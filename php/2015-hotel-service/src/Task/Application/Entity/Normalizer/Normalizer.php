<?php

namespace Task\Application\Entity\Normalizer;

use InvalidArgumentException;

use Task\Application\Entity\BaseEntity;
use Task\Application\Entity\Collection\BaseCollection;

/**
 * Class Normalizer
 *
 * Turns Entity to Array and vise versa including its dependent collections
 * Each field can have initializer and/or formatter method (defined within Entity)
 *
 * @package Task\Application\Entity\Normalizer
 */
class Normalizer
{
    /**
     * Entity => Array
     *
     * @param BaseEntity $oEntity
     *
     * @return array
     */
    public function normalize(BaseEntity $oEntity)
    {
        if (empty($oEntity)) {
            throw new InvalidArgumentException('Given entity is invalid.');
        }

        $aResult = array();

        foreach ($oEntity->getFieldMapping() as $sPropName => $field) {
            if ($oEntity->$sPropName instanceof BaseCollection) {
                /** @var BaseCollection $oCollection */
                $oCollection = $oEntity->$sPropName;
                $aResult[$field] = $oCollection->normalize($this);

                continue;
            }

            $formatter = null;
            if (is_array($field)) {
                $formatter = method_exists($oEntity, $field['formatter'])
                    ? $field['formatter']
                    : null;

                $field = $field['name'];
            }

            $aResult[$field] = $formatter
                ? $oEntity->$formatter($oEntity->$sPropName)
                : $oEntity->$sPropName;
        }

        return $aResult;
    }

    /**
     * Array => Entity
     *
     * @param array $aData
     * @param string $sEntityClassName
     *
     * @return BaseEntity
     */
    public function denormalize(array $aData, $sEntityClassName)
    {
        if (!class_exists($sEntityClassName)) {
            throw new InvalidArgumentException(sprintf('Given entity class name [%s] is not exists.', $sEntityClassName));
        }

        /** @var BaseEntity $oEntity */
        $oEntity = new $sEntityClassName();

        if (!$oEntity instanceof BaseEntity) {
            throw new InvalidArgumentException(sprintf('Given entity class name [%s] is not inherited from BaseEntity.', $sEntityClassName));
        }

        foreach ($oEntity->getFieldMapping() as $sPropName => $field) {
            if ($oEntity->$sPropName instanceof BaseCollection) {
                /** @var BaseCollection $oCollection */
                $oCollection = $oEntity->$sPropName;
                $oCollection->denormalize($aData[$field], $this);

                continue;
            }

            $initializer = null;
            if (is_array($field)) {
                $initializer = method_exists($oEntity, $field['initializer'])
                    ? $field['initializer']
                    : null;

                $field = $field['name'];
            }

            if (isset($aData[$field])) {
                $oEntity->$sPropName = $initializer
                    ? $oEntity->$initializer($aData[$field])
                    : $aData[$field];
            }
        }

        return $oEntity;
    }

}