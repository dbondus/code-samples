<?php

namespace Task\Application\Service\DataSourceService;

interface DataSourceServiceInterface
{

    /**
     * @param integer $iDataId
     */
    function collectDataById($iDataId);
}