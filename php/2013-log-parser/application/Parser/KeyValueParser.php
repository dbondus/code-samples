<?php

namespace application\parser {

    use application as app;

    class KeyValueParser extends app\Parser
    {
        protected function __processLine($raw)
        {
            $pairs = explode("\t", $raw);

            $res = array();
            $i = 0;
            $iLen = count($pairs);
            while ($i < $iLen) {
                if (strpos($pairs[$i], '=') !== false) {
                    $tmp = explode('=', $pairs[$i], 2);
                    $res[$tmp[0]] = isset($tmp[1]) ? $tmp[1] : '';
                }
                $i++;
            }

            return $res;
        }
    }
}
