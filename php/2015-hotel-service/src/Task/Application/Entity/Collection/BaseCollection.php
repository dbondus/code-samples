<?php
namespace Task\Application\Entity\Collection;

use ArrayAccess;
use Closure;
use Countable;

use Task\Application\Entity\BaseEntity;
use Task\Application\Entity\Normalizer\Normalizer;
use Task\Application\Entity\Validator\Validator;

class BaseCollection implements Countable, ArrayAccess
{
    /**
     * @var string
     */
    protected $sEntityClassName = 'Task\Application\Entity\BaseEntity';

    /**
     * @var BaseEntity[]
     */
    protected $aList = array();

    public function normalize(Normalizer $oNormalizer)
    {
        $aResult = array();

        foreach($this->aList as $oEntity)
        {
            //there could be a problem in case of large int keys
            $aResult[$oEntity->iId] = $oNormalizer->normalize($oEntity);
        }

        return $aResult;
    }

    public function denormalize(array $aData, Normalizer $oNormalizer)
    {
        $this->aList = array();

        foreach($aData as $iId => $aEntityData)
        {
            $entity = $oNormalizer->denormalize($aEntityData, $this->sEntityClassName);
            $entity->iId = $iId;

            $this->aList[] = $entity;
        }

        return $this;
    }

    public function validate(Validator $oValidator, Closure $fnOnInvalid)
    {
        //walking in reverse order to make possible safe entity deletion
        $iInd = count($this->aList);
        while(--$iInd >= 0)
        {
            $oValidator->validate($this->aList[$iInd], $fnOnInvalid, $this, $iInd);
        }
    }

    public function sort(Closure $fnSorter)
    {
        usort($this->aList, $fnSorter);
    }

    public function toArray()
    {
        return array_slice($this->aList, 0);
    }

    /**
     * @inheritdoc
     */
    public function count()
    {
        return count($this->aList);
    }

    /**
     * @inheritdoc
     */
    public function offsetExists($offset)
    {
        return isset($this->aList[$offset]);
    }

    /**
     * @inheritdoc
     */
    public function offsetGet($offset)
    {
        return isset($this->aList[$offset])
            ? $this->aList[$offset]
            : null;
    }

    /**
     * @inheritdoc
     */
    public function offsetSet($offset, $value)
    {
        $this->aList[$offset] = $value;
    }

    /**
     * @inheritdoc
     */
    public function offsetUnset($offset)
    {
        unset($this->aList[$offset]);
    }
}