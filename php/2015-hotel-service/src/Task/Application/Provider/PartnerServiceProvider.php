<?php

namespace Task\Application\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;

use Task\Application\Service\PartnerService\MyPartnerService;

class PartnerServiceProvider implements ServiceProviderInterface
{
    public function register(Container $container)
    {
        $container['partner_service'] = function () use ($container) {
            return new MyPartnerService(
                $container['city_data_source'],
                $container['entity_normalizer'],
                $container['entity_validator']
            );
        };
    }
}