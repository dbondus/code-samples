<?php
namespace application {
	use Exception;

	abstract class Parser {
        /**
         * Parser constructor.
         * @param \application\Utils $utils
         */
        function __construct($utils) {
            $this->utils = $utils;
        }

		/**
		 * @param string $filePath
		 * @param callable $blockProcessor  - function to process block of lines
		 * @param int $blockSize
		 * @throws \Exception
		 */
		public function parse($filePath, $blockProcessor, $blockSize = 10) {
			if(!is_callable($blockProcessor)) {
				throw new Exception('BlockProcessor for "' . $filePath . '" is not defined');
			}

			$fp = $this->utils->openFile($filePath, 'r');
			while(!feof($fp)) {
				$block = $this->_getBlock($fp, $blockSize);

                $blockProcessor($block);
			}
			fclose($fp);
		}

        /**
         * @param string $raw
         * @return array
         * @throws \Exception
         */
        protected function __processLine($raw) {
            throw new Exception('override me!');
        }

        /**
         * @param resource $fPointer
         * @param int $size
         * @return array
         */
		private function _getBlock($fPointer, $size) {
			$linesCnt = 0;
			$block = array();

			while($linesCnt < $size && !feof($fPointer)) {
				$data = $this->__processLine(fgets($fPointer));

				$data && ($block[] = $data);

				$linesCnt++;
			}

			return $block;
		}
	}
}
