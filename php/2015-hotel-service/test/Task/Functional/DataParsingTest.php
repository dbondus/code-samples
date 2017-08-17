<?php

namespace Task\Functional;

use org\bovigo\vfs\vfsStream;
use org\bovigo\vfs\vfsStreamDirectory;

use PHPUnit_Framework_TestCase;

use Task\Application;
use Task\Application\Entity\Hotel;
use Task\Application\Entity\Partner;
use Task\Application\Entity\Price;
use Task\Application\Service\PartnerService\MyPartnerService;

class DataParsingTest extends PHPUnit_Framework_TestCase
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

    public function testShouldCollectHotelList()
    {
        /** @var MyPartnerService $oService */
        $oService = $this->oApplication['partner_service'];

        $oHotels = $oService->getResultForCityId(15475);
        $this->assertEquals(2, count($oHotels), 'incomplete list of hotels');

        /** @var Hotel $oHotel */
        $oHotel = $oHotels[0];
        $this->assertInstanceOf('Task\Application\Entity\Hotel', $oHotel);
        $this->assertInstanceOf('Task\Application\Entity\Collection\PartnerCollection', $oHotel->oPartners);
        $this->assertEquals(2, count($oHotel->oPartners), 'incomplete list of partners');

        /** @var Partner $oPartner */
        $oPartner = $oHotel->oPartners[0];
        $this->assertInstanceOf('Task\Application\Entity\Partner', $oPartner);
        $this->assertInstanceOf('Task\Application\Entity\Collection\PriceCollection', $oPartner->oPrices);
        $this->assertEquals(2, count($oPartner->oPrices), 'incomplete list of prices');

        /** @var Price $oPrice */
        $oPrice = $oPartner->oPrices[0];
        $this->assertInstanceOf('Task\Application\Entity\Price', $oPrice);
        $this->assertInstanceOf('DateTime', $oPrice->oFromDate);

        $oHotel = $oHotels[1];
        $this->assertEquals(2, count($oHotel->oPartners), 'hotel [id:3] has incomplete list of partners');
    }
}