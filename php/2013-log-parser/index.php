<?php
require_once('application\\system\\bootstrap.php');

use application\Parser as parser;
use application\Converter as Converter;
use application\Utils as Utils;

define('LOG_FORMAT_JSON', 'JSON');
define('LOG_FORMAT_KEY_VALUE', 'KeyValue');

$files = require_once('application\\system\\config.php');

$parsers = array();
$utils = new Utils();

foreach($files as $path) {
	$fileFormat = $utils->getLogFileFormat($path);
	$parser = null;

	if(isset($parsers[$fileFormat])) {
		$parser = $parsers[$fileFormat];
	} else {
		switch($fileFormat) {
			case LOG_FORMAT_JSON:
				$parser = new parser\JSONParser($utils);
			break;

			case LOG_FORMAT_KEY_VALUE:
				$parser = new parser\KeyValueParser($utils);
			break;

			default:
				throw new Exception('Undefined file format');
		}

		$parsers[$fileFormat] = $parser;
	}

	Converter::convertToCSV($path, $path.'.csv', $parser, $utils);
}