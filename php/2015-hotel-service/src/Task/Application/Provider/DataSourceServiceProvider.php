<?php

namespace Task\Application\Provider;

use InvalidArgumentException;
use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Task\Application\Service\DataSourceService\JsonDataSourceService;

class DataSourceServiceProvider implements ServiceProviderInterface
{
    /**
     * @param Container $container
     * @throws InvalidArgumentException
     */
    public function register(Container $container)
    {
        $container['city_data_source'] = function() use ($container) {
            $iMaxDepth = isset($container['city_data_source.json.max_depth'])
                ? $container['city_data_source.json.max_depth']
                : 512;

            return new JsonDataSourceService($container['city_data_source.json.storage_path'], $iMaxDepth);
        };
    }
}