<?php

namespace Task\Functional;

use org\bovigo\vfs\vfsStream;
use org\bovigo\vfs\vfsStreamDirectory;

use PHPUnit_Framework_TestCase;

use Task\Application;
use Task\Application\Entity\Hotel;
use Task\Application\Entity\Partner;
use Task\Application\Entity\Price;
use Task\Application\Service\HotelService\MyHotelService;
use Task\Application\Sorter\PartnersByNameSorter;
use Task\Application\Sorter\PricesByValueSorter;

class HotelDataSortingTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var vfsStreamDirectory
     */
    protected $vfsJsonDirectory;

    /**
     * @var Application
     */
    protected $oApplication;

    protected function setUp()
    {
        vfsStream::setup('jsonDir');
        $this->vfsJsonDirectory = vfsStream::copyFromFileSystem(__DIR__ . '/../Fixtures/Cities');

        $this->oApplication = new Application(array(
            'city_data_source.json.storage_path' => vfsStream::url('jsonDir') . DIRECTORY_SEPARATOR
        ));
    }

    public function testShouldOrderPartnersByNameInHotels()
    {
        /** @var MyHotelService $oService */
        $oService = $this->oApplication['hotel_service'];

        $oSorter = new PartnersByNameSorter();
        $oService->setSorter($oSorter);

        /** @var Hotel[] $aHotels */
        $aHotels = $oService->getHotelsForCity('Düsseldorf');

        /** @var Partner[] $aPartners */
        $aPartners = $aHotels[0]->oPartners->toArray();

        $this->assertEquals(102, $aPartners[0]->iId);
        $this->assertEquals(101, $aPartners[1]->iId);

        /** @var Partner[] $aPartners */
        $aPartners = $aHotels[1]->oPartners->toArray();

        $this->assertEquals(303, $aPartners[0]->iId);
        $this->assertEquals(302, $aPartners[1]->iId);
    }

    public function testShouldOrderPricesInHotelPartners()
    {
        /** @var MyHotelService $oService */
        $oService = $this->oApplication['hotel_service'];

        $oSorter = new PricesByValueSorter();
        $oService->setSorter($oSorter);

        /** @var Hotel[] $aHotels */
        $aHotels = $oService->getHotelsForCity('Düsseldorf');

        /** @var Partner[] $aPartners */
        $aPartners = $aHotels[0]->oPartners->toArray();
        /** @var Price[] $aPrices */
        $aPrices = $aPartners[0]->oPrices->toArray();
        $this->assertEquals(1001, $aPrices[0]->iId);
        $this->assertEquals(1002, $aPrices[1]->iId);

        $aPartners = $aHotels[0]->oPartners->toArray();
        $aPrices = $aPartners[1]->oPrices->toArray();
        $this->assertEquals(1004, $aPrices[0]->iId);
        $this->assertEquals(1003, $aPrices[1]->iId);

        $aPartners = $aHotels[1]->oPartners->toArray();
        $aPrices = $aPartners[0]->oPrices->toArray();
        $this->assertEquals(3003, $aPrices[0]->iId);
        $this->assertEquals(3005, $aPrices[1]->iId);
        $this->assertEquals(3004, $aPrices[2]->iId);

        $aPartners = $aHotels[1]->oPartners->toArray();
        $aPrices = $aPartners[1]->oPrices->toArray();
        $this->assertEquals(3007, $aPrices[0]->iId);
        $this->assertEquals(3006, $aPrices[1]->iId);
    }
}