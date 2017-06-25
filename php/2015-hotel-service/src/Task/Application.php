<?php

namespace Task;

use Pimple\Container;

use Task\Application\Entity\Normalizer\Normalizer;
use Task\Application\Entity\Validator\Validator;
use Task\Application\Provider\DataSourceServiceProvider;
use Task\Application\Provider\HotelServiceProvider;
use Task\Application\Provider\PartnerServiceProvider;

class Application extends Container
{

    public function __construct(array $values = array())
    {
        parent::__construct();

        $this['debug'] = false;

        $this->registerDefaultServices();

        $this->overrideDefaultValues($values);
    }

    protected function registerDefaultServices()
    {
        $this->register(
            new DataSourceServiceProvider(),
            array(
                'city_data_source.json.storage_path' => 'data' . DIRECTORY_SEPARATOR,
                'city_data_source.json.max_depth' => 512
            )
        );

        $this['entity_normalizer'] = function() {
            return new Normalizer();
        };

        $this['entity_validator'] = function() {
            return new Validator();
        };

        $this->register(
            new PartnerServiceProvider()
        );

        $this->register(
            new HotelServiceProvider()
        );
    }

    private function overrideDefaultValues(array $values)
    {
        foreach ($values as $key => $value) {
            $this[$key] = $value;
        }
    }
}