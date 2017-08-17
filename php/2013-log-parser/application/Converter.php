<?php

namespace application {
    class Converter
    {
        /**
         * @param string $srcFilePath
         * @param string $dstFilePath
         * @param \application\Parser $parser
         * @param \application\Utils $utils
         * @internal param string $filePath
         */
        public static function convertToCSV($srcFilePath, $dstFilePath, $parser, $utils)
        {
            $fieldsList = [];

            $fp = $utils->openFile($dstFilePath, 'w');

            $parser->parse($srcFilePath, function ($arrData) use ($fp, $fieldsList) {
                $i = 0;
                $iLen = count($arrData);
                while ($i < $iLen) {
                    $recordFields = array_keys($arrData[$i]);

                    $newFields = array_diff($recordFields, $fieldsList);
                    $newFields && ($fieldsList = array_merge($fieldsList, $newFields));

                    $missingFields = array_diff($fieldsList, $recordFields);
                    if ($missingFields) {
                        foreach ($missingFields as $name) {
                            $arrData[$i][$name] = '';
                        }
                    }

                    ksort($arrData[$i]);

                    fputcsv($fp, $arrData[$i]);

                    $i++;
                }
            }, 20);

            fclose($fp);
        }
    }
}