<?php
namespace Task\Application\Service\DataSourceService;

class JsonDataSourceService implements DataSourceServiceInterface
{
    /**
     * @var string
     */
    protected $sPath;

    /**
     * @var integer
     */
    protected $iMaxDepth;

    /**
     * @param string $sPath
     * @param integer $iMaxDepth
     */
    public function __construct($sPath, $iMaxDepth = 512)
    {
        $this->sPath = $this->ensureTrailingSlash($sPath);
        $this->iMaxDepth = $iMaxDepth;
    }

    /**
     * @param integer $iDataId
     * @return array|null
     */
    public function collectDataById($iDataId)
    {
        $sFile = sprintf('%s%d.json', $this->sPath, $iDataId);

        if(!file_exists($sFile))
        {
            return null;
        }

        $sData = file_get_contents($sFile);

        $oResult = json_decode($sData, true, $this->iMaxDepth);

        return $oResult
            ? $oResult
            : null;
    }

    private function ensureTrailingSlash($sPath)
    {
        $sPath = rtrim($sPath, DIRECTORY_SEPARATOR);

        return $sPath . '/';
    }
}