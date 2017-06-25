<?php
namespace application {
	use Exception;

	class Utils {
		/**
		 * Define log file format by first string
		 *
		 * @param string $filePath
		 * @return string
		 */
		public function getLogFileFormat($filePath) {
			$fp = self::openFile($filePath, 'r');
			$str = fgets($fp);
			fclose($fp);

			return json_decode($str) ? LOG_FORMAT_JSON : LOG_FORMAT_KEY_VALUE;
		}

		/**
		 * Throw exception if something is wrong with file
		 *
		 * @param string $filePath
		 * @param string $mode
		 * @return resource
		 * @throws \Exception
		 */
		public function openFile($filePath, $mode) {
			$fp = @fopen($filePath, $mode);
			if(empty($fp)) {
				throw new Exception('Can\'t open file: "' . $filePath . '"');
			}

			return $fp;
		}
	}
}