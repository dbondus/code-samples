<?php

namespace Task\Application\Provider;

use Pimple\Container;
use Pimple\ServiceProviderInterface;

use Task\Application\Service\HotelService\MyHotelService;

class HotelServiceProvider implements ServiceProviderInterface
{
    public function register(Container $container)
    {
        $container['hotel_service'] = function() use ($container) {
            return new MyHotelService(
                $container['partner_service']
            );
        };
    }
}