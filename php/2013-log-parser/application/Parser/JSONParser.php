<?php

namespace application\Parser {

    use application as app;

    class JSONParser extends app\Parser
    {
        protected function __processLine($raw)
        {
            $data = json_decode($raw, true);
            return $data ? $data : array();
        }
    }
}
