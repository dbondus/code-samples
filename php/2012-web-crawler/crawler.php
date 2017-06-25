<?php
declare(ticks = 1);
error_reporting(E_ALL);

define('MAX_PROCESSES', 40);

pcntl_signal(SIGINT, function() {
    exit(1);
});

pcntl_signal(SIGTERM, function() {
    exit(1);
});

$crawler = new Crawler($argv[1]);
$crawler->run();
$crawler->createReport();

/**
 * bot
 */
class Crawler {

    /**
     * @var array
     */
    private $_runningProcesses = array();

    /**
     * @var bool
     */
    private $_isMainProcess = true;


    /**
     * @var null
     */
    private $_domain = null;

    /**
     * @var null
     */
    private $_wwwDomain = null;

    /**
     * @var string
     */
    private $_workPath = '/tmp/';

    /**
     * cache
     * @var array
     */
    private $_urls = array();

    /**
     * processing queue
     * @var array
     */
    private $_urlsQueue = array();

    /**
     * @var int
     */
    private $_processCnt = 0;

    /**
     * @param string $url starting url
     */
    public function __construct($url) {
        $tmp = $this->_processTargetUrl($url);
    }

    /**
     * extract domain and prepar first url for queue
     * @param string $url
     */
    private function _processTargetUrl($url) {
        $url = rtrim($url, '/');
        $url = str_replace('http://', '', $url);

        $parts = explode('/', $url);

        $this->_domain = $parts[0];

        if(!preg_match('/^([a-zA-Z\d][a-zA-Z\d\-]{0,62}\b\.){1,126}[a-zA-Z\/]{1,6}$/', $this->_domain)) {
            echo "Domain name is incorrect!\n";
            exit(1);
        }

        if(strpos($this->_domain, 'www') === 0) {
            $this->_wwwDomain = $this->_domain;
            $this->_domain = str_replace('www.', '', $this->_domain);
        } else {
            $this->_wwwDomain = 'www.' . $this->_domain;
        }

        $url = 'http://' . $url;
        $this->_urlsQueue[$url] = true;
    }

    /**
     * common destructor
     */
    public function __destruct() {
        if ($this->_isMainProcess) {
            //final cleanup
            //echo 'main dead';
        }else {
            //echo 'child dead';
        }
    }

    /**
     * start child process for each url from queue and
     * handle data from finished process
     */
    public function run() {
        $this->_isMainProcess = false;

        $canContinue = true;

        while ($canContinue) {
            //start child process
            if ($this->_processCnt < MAX_PROCESSES && $this->_urlsQueue) {
                reset($this->_urlsQueue);
                $nextUrl = key($this->_urlsQueue);

                $pid = $this->_newProcess($nextUrl);
                if ($pid) {
                    echo $nextUrl."\n";
                    $this->_runningProcesses[] = array(
                        'pid' => $pid,
                        'taskId' => $this->_taskId
                    );
                } else {
                    // can't start chilld process... working in one main process
                    $this->_processURL($nextUrl);
                    $this->_processTaskData($this->_taskId);
                }

                unset($this->_urlsQueue[$nextUrl]);
            }

            // take care of finished processes
            foreach ($this->_runningProcesses as $i => $info) {
                if (pcntl_waitpid($info['pid'], $status, WNOHANG) > 0) {
                    $this->_processTaskData($info['taskId']);

                    unset($this->_runningProcesses[$i]);

                    $this->_processCnt--;
                }
            }

            //"exit" condition
            if(!$this->_processCnt && !$this->_urlsQueue) {
                $this->_isMainProcess = true;
                $canContinue = false;
            } else {
                sleep(0.2);
            }
        }
    }

    /**
     * handle child process's data file
     * @param string $taskId
     */
    private function _processTaskData($taskId) {
        if(!file_exists($this->_workPath.$taskId)) {
            return;
        }
        $data = unserialize(file_get_contents($this->_workPath.$taskId));

        $urls = $data['urls'];

        //save metrics for processed url
        $this->_urls[$data['url']] = array(
            'images' => $data['images'],
            'duration' => $data['duration']
        );

        foreach($urls as $rawUrl) {
            //ignore
            if(strpos($rawUrl, ':') !== false && strpos($rawUrl, 'http') !==0) {
                $this->_log('INVALID ' . $rawUrl);
                continue;
            }

            $rawUrl = rtrim($rawUrl, "\n");
            $url = $this->_getAbsolutePath($data['url'], $rawUrl);
            $logStr = $rawUrl . ' >> ' . $url;

            //check for new url
            if(!isset($this->_urls[$url])) {
                $tmp = str_replace('http://', '', $url);
                //check for site bounds
                if(strpos($tmp, $this->_domain) === 0 || strpos($tmp, $this->_wwwDomain) === 0) {
                    $this->_urlsQueue[$url] = true;
                    $this->_urls[$url] = true;
                    $this->_log('CORRECT ' . $logStr);
                } else {
                    //$this->_urls[$url] = false;
                    $this->_log('IGNORE ' . $logStr);
                }
            } else {
                $this->_log('DUPLICATE ' . $logStr);
            }
        }

        unlink($this->_workPath.$taskId);
    }

    /**
     * fork child process with uniq id
     * @param string $url
     */
    private function _newProcess($url) {
        $this->_processCnt++;
        $this->_taskId = uniqid('.process_');

        $pid = pcntl_fork();

        if ($pid == -1) { //error
            return false;
        }elseif ($pid) { // parent
            return $pid;
        }

        $this->_processURL($url);

        exit(0);
    }

    /**
     * convert relative url to absolute and keep url's format
     * @param string $basePath
     * @param string $relativePath
     * @return string
     */
    private function _getAbsolutePath($basePath, $relativePath) {
        preg_match('/\.html?$/', $basePath) && ($basePath = substr($basePath, 0, strrpos($basePath, '/')));
        //site root
        if ($relativePath == '/') {
            return 'http://'.$this->_domain;
        }

        $relativePath = rtrim($relativePath, '/');

        //already absolute
        if (strpos($relativePath, 'http://') === 0) {
            return $relativePath;
        }
        if (strpos($relativePath, 'https://') === 0) {
            return $relativePath;
        }

        //anchor
        if(strpos($relativePath, '#') !== false) {
            $relativePath = preg_replace('/#.*/', '', $relativePath);
        }

        //empty
        if(!strlen($relativePath)) {
            return rtrim($basePath, '/');
        }

        if($relativePath[0] == '/') {
            //from root
            $absoluteParts = array($this->_domain);
            $relativeParts = explode('/', trim($relativePath, '/'));
        } else {
            //from base
            $absoluteParts = explode('/', rtrim(str_replace(array('http://', 'https://'), '', $basePath), '/'));
            array_pop($absoluteParts);
            $relativeParts = explode('/', $relativePath);
        }

        //keep root in case malformed relative path
        $root = array_shift($absoluteParts) . '/';

        foreach($relativeParts as $part) {
            switch($part) {
                case '..':
                    array_pop($absoluteParts);
                    break;

                case '.':
                    break;

                default:
                    $absoluteParts[] = $part;
            }
        }

        return 'http://' . $root . join('/', $absoluteParts);
    }

    /**
     * get html from url and count metrics data
     * @param string $url
     */
    private function _processURL($url) {
        $startTime = $this->_getMicrotime();

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_FAILONERROR, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);
        $result = curl_exec ($ch);
        curl_close ($ch);
        if($result) {
            $dom = new DOMDocument('1.0');
            @$dom->loadHTML($result);

            $links = $dom->getElementsByTagName('a');
            $urls = array();
            foreach ($links as $link) {
                $href = $link->getAttribute('href');
                //ignore static files except html and htm
                (preg_match('/\.html?$/', $href) || !preg_match('/\.\w{1,5}$/', $href)) && ($urls[] = $href);
            }

            $imgs = $dom->getElementsByTagName('img');

            $this->_saveValue(array(
                'url' => $url,
                'urls' => $urls,
                'images' => $imgs->length,
                'duration' => $this->_getMicrotime() - $startTime
            ));
        }else {
            $this->_saveValue(array(
                'url' => $url,
                'urls' => array(),
                'images' => 0,
                'duration' => $this->_getMicrotime() - $startTime
            ));
        }
    }

    /**
     * @return float
     */
    private function _getMicrotime() {
        return microtime(true);
    }

    /**
     * save process's serialized data in uniq file
     * @param $value
     */
    private function _saveValue($value) {
        file_put_contents($this->_workPath.$this->_taskId, serialize($value));
    }

    /**
     * @param string $value
     */
    private function _log($value) {
        file_put_contents('log', $value."\n", FILE_APPEND);
        //echo $value."\n";
    }

    /**
     * prepare data for report generation
     * @return array
     */
    private function _filterData() {
        //get only processed urls
        $res = array_filter($this->_urls, function($value) {
            return is_array($value);
        });

        //sort by images count
        uasort($res, function ($val1, $val2) {
            if ($val1['images'] == $val2['images']) {
                return 0;
            }

            return ($val1['images'] < $val2['images']) ? 1 : -1;
        });

        return $res;
    }

    /**
     * generate html report file
     */
    public function createReport() {
        $data = $this->_filterData();

        $reportFile = 'report_' . date('d.m.Y') . '.html';

        $tableHeaders = array(
            'Address',
            '&lt;img&gt; Count',
            'Processing duration'
        );

        //report header
        $result = array('<!DOCTYPE html><html><head><title>Crawler Report</title></head><body><table><tr>');
        foreach($tableHeaders as $header) {
            $result[] = "<th>{$header}</th>";
        }
        $result[] = "</tr>\n";

        file_put_contents($reportFile, join('', $result));

        $cnt = count($data);

        if($cnt) {
            $part = 1;
            $partLimit = 50;
            $partLimit > $cnt && ($partLimit = $cnt);
            $parts = floor($cnt / $partLimit);

            //report data
            //export in parts by 50 rows
            $i = 0;
            reset($data);
            while($part <= $parts) {
                $result = array();
                $iLen = $part*$partLimit;
                $iLen > $cnt && ($iLen -= $iLen - $cnt);
                while($i < $iLen) {
                    $result[] = '<tr>';

                    list($addr, $row) = each($data);

                    $result[] = "<td>{$addr}</td>";
                    foreach($row as $col) {
                        $result[] = "<td>{$col}</td>";
                    }

                    $result[] = "</tr>\n";
                    $i++;
                }

                file_put_contents($reportFile, join('', $result), FILE_APPEND);

                $part++;
            }
        }

        file_put_contents($reportFile, '</table></body></html>', FILE_APPEND);
    }

}

exit(0);