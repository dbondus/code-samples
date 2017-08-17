<?php

namespace Task\Application\Sorter;

use Task\Application\Entity\Collection\PartnerCollection;
use Task\Application\Entity\Hotel;
use Task\Application\Entity\Partner;

class PartnersByNameSorter extends BaseHotelDataSorter
{
    protected function applySorting(array $aHotels)
    {
        $aAllPartnerCollections = array_map(function (Hotel $oHotel) {
            return $oHotel->oPartners;
        }, $aHotels);

        array_walk($aAllPartnerCollections, function (PartnerCollection $oCollection) {
            $oCollection->sort(function (Partner $oFirstPartner, Partner $oSecondPartner) {
                //there could be a problem with UNICODE
                return strcmp($oFirstPartner->sName, $oSecondPartner->sName);
            });
        });

        return $aHotels;
    }
}