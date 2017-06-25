<?php

namespace Task\FeedbackBundle\EventListener;

use Doctrine\ORM\Event\LoadClassMetadataEventArgs;
use Doctrine\ORM\Mapping\ClassMetadataInfo;

class CustomEntityMappingListener {
    /**
     * @var array
     */
    private $_map;

    function __construct(array $map = []) {
        $this->_map = $map;
    }

    public function loadClassMetadata(LoadClassMetadataEventArgs $eventArgs) {
        /** @var ClassMetadataInfo $classMetadata */
        $classMetadata = $eventArgs->getClassMetadata();
        $entityName = $classMetadata->getName();

        if(isset($this->_map[$entityName])) {
            $classMetadata->setPrimaryTable([
                'name' => $this->_map[$entityName]
            ]);
        }
    }
}