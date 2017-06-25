<?php
namespace Task\Application\Sorter;

use Task\Application\Entity\Hotel;

class BaseHotelDataSorter implements SorterInterface
{
    /**
     * @param array $aHotels
     *
     * @return array
     */
    function sort(array $aHotels)
    {
        $this->validateData($aHotels);

        return $this->applySorting($aHotels);
    }

    protected function validateData(array $aHotels)
    {
        if (!$aHotels)
        {
            throw new \InvalidArgumentException('Hotels array is invalid');
        }

        if(!$aHotels[0] instanceof Hotel)
        {
            throw new \InvalidArgumentException(sprintf('$aHotels should contain only Hotel entities, but there is %s instance', get_class($aHotels[0])));
        }
    }

    protected function applySorting(array $aHotels)
    {
        return $aHotels;
    }
}