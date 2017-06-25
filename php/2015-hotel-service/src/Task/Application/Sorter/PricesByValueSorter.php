<?php
namespace Task\Application\Sorter;

use Task\Application\Entity\Collection\PriceCollection;
use Task\Application\Entity\Hotel;
use Task\Application\Entity\Partner;
use Task\Application\Entity\Price;

class PricesByValueSorter extends BaseHotelDataSorter
{
    protected function applySorting(array $aHotels)
    {
        $aAllPartners = array();
        array_walk($aHotels, function(Hotel $oHotel) use(&$aAllPartners) {
            $aAllPartners = array_merge($aAllPartners, $oHotel->oPartners->toArray());
        });

        $aAllPriceCollections = array_map(function(Partner $oPartner) {
            return $oPartner->oPrices;
        }, $aAllPartners);

        array_walk($aAllPriceCollections, function(PriceCollection $oCollection) {
            $oCollection->sort(function(Price $oFirstPrice, Price $oSecondPrice) {
                if ($oFirstPrice->fAmount == $oSecondPrice->fAmount) {
                    return 0;
                }

                return ($oFirstPrice->fAmount < $oSecondPrice->fAmount)
                    ? -1
                    : 1;
            });
        });

        return $aHotels;
    }
}