<?php
namespace Task\Application\Entity\Validator;

use Closure;
use Task\Application\Entity\BaseEntity;
use Task\Application\Entity\Collection\BaseCollection;

/**
 * Class Validator
 *
 * Provides validation based on rules listed in Entity
 * Can use basic Regex constraint or complex validation method (defined within Entity)
 *
 * @package Task\Application\Entity\Validator
 */
class Validator
{
    /**
     *
     * All dependent collections of $oEntity are processed last if there has been no errors
     * or neither of $fnOnInvalidProperty calls has stopped validation process
     *
     * @param BaseEntity $oEntity
     *
     * @param Closure $fnOnInvalidProperty
     * If callable returns TRUE then validation process stops for the $oEntity
     * args: BaseCollection $oCollection, $iInd, BaseEntity $oEntity, $sPropName, $sError
     *
     * @param int $iInd
     * Entity index in the parent collection
     *
     * @param BaseCollection $oCollection
     * Parent collection
     */
    public function validate(BaseEntity $oEntity, Closure $fnOnInvalidProperty, BaseCollection $oCollection = null, $iInd = 0)
    {
        foreach ($oEntity->getValidationRules() as $sPropName => $rule)
        {
            $bError = false;
            $sMessage = $rule['message'];
            list($sType, $sValue) = explode(':', $rule['constraint'], 2);

            switch($sType)
            {
                case 'regex':
                    $bError = !preg_match($sValue, $oEntity->$sPropName);
                break;

                default:
                    if(method_exists($oEntity, $sValue))
                    {
                        $bError = $oEntity->$sValue($oEntity->$sPropName);
                    }
            }

            if($bError && $fnOnInvalidProperty($oCollection, $iInd, $oEntity, $sPropName, $sMessage))
            {
               return;
            }
        }

        $this->validateDependentCollections($oEntity, $fnOnInvalidProperty);
    }

    /**
     * @param BaseEntity $oEntity
     *
     * @param Closure $fnOnInvalidProperty
     * If callable returns TRUE then validation process stops for that entity
     * args: BaseCollection $oCollection, $iInd, BaseEntity $oEntity, $sPropName, $sError
     *
     */
    public function validateDependentCollections(BaseEntity $oEntity, Closure $fnOnInvalidProperty)
    {
        foreach ($oEntity->getFieldMapping() as $sPropName => $sFieldName)
        {
            if ($oEntity->$sPropName instanceof BaseCollection)
            {
                /** @var BaseCollection $oCollection */
                $oCollection = $oEntity->$sPropName;
                $oCollection->validate($this, $fnOnInvalidProperty);
            }
        }
    }
}