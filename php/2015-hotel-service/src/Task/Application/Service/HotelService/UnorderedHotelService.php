<?php
namespace Task\Application\Service\HotelService;

use Task\Application\Service\PartnerService\PartnerServiceInterface;

/**
 * This class is an (unfinished) example implementation of an unordered hotel service.
 *
 * @author mmueller
 */
class UnorderedHotelService implements HotelServiceInterface
{

    /**
     * @var PartnerServiceInterface
     */
    private $oPartnerService;

    /**
     * Maps from city name to the id for the partner service.
     *  
     * @var array
     */
    private $aCityToIdMapping = array(
        "Düsseldorf" => 15475
    );

    /**
     * @param PartnerServiceInterface $oPartnerService
     */
    public function __construct(PartnerServiceInterface $oPartnerService)
    {
       $this->oPartnerService = $oPartnerService;
    }

    /**
     * @inherited
     */
    public function getHotelsForCity($sCityName)
    {
        if (!isset($this->aCityToIdMapping[$sCityName]))
        {
            throw new \InvalidArgumentException(sprintf('Given city name [%s] is not mapped.', $sCityName));
        }

        $iCityId = $this->aCityToIdMapping[$sCityName];
        return $this->oPartnerService->getResultForCityId($iCityId);
    }
}