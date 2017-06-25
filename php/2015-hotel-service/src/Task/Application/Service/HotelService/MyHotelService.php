<?php
namespace Task\Application\Service\HotelService;

use Task\Application\Sorter\SorterInterface;
use Task\Application\Service\PartnerService\PartnerServiceInterface;

class MyHotelService implements HotelServiceInterface
{
    /**
     * @var SorterInterface
     */
    protected $oSorter;

    /**
     * @var PartnerServiceInterface
     */
    protected $oPartnerService;

    /**
     * Maps from city name to the id for the partner service.
     *  
     * @var array
     */
    private $aCityToIdMapping = array(
        "SomeCity" => 12345
    );

    /**
     * @param PartnerServiceInterface $oPartnerService
     */
    public function __construct(PartnerServiceInterface $oPartnerService)
    {
       $this->oPartnerService = $oPartnerService;
    }

    public function setSorter($oSorter)
    {
        $this->oSorter = $oSorter;
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
        $aPartnerResults = $this->oPartnerService->getResultForCityId($iCityId);

        if($this->oSorter)
        {
            $aPartnerResults = $this->oSorter->sort($aPartnerResults);
        }

        return $aPartnerResults;
    }
}