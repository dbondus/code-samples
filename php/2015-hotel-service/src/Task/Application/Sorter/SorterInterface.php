<?php

namespace Task\Application\Sorter;

interface SorterInterface
{
    /**
     * @param $aData
     * @return array
     */
    function sort(array $aData);
}