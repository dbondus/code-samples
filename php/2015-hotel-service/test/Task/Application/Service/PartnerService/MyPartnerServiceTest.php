<?php
namespace Task\Application\Service\PartnerService;

use PHPUnit_Framework_TestCase;

use Task\Application\Entity\Normalizer\Normalizer;
use Task\Application\Entity\Validator\Validator;
use Task\Application\Service\DataSourceService\JsonDataSourceService;

class MyPartnerServiceTest extends PHPUnit_Framework_TestCase
{
    public function testShouldCollectHotelArrayByCityId()
    {
        $oDataSourceMock = $this->getMockBuilder('Task\Application\Service\DataSourceService\JsonDataSourceService')
                                ->disableOriginalConstructor()
                                ->setMethods(array('collectDataById'))
                                ->getMock();

        $oDataSourceMock->expects($this->once())
                        ->method('collectDataById')
                        ->will($this->returnValue(array(
                            'hotels' => array()
                        )));

        /** @var Normalizer $oNormalizerMock */
        $oNormalizerMock = $this->getMock('Task\Application\Entity\Normalizer\Normalizer');
        /** @var Validator $oValidatorMock */
        $oValidatorMock = $this->getMock('Task\Application\Entity\Validator\Validator');

        /** @var JsonDataSourceService $oDataSourceMock */
        $oService = new MyPartnerService($oDataSourceMock, $oNormalizerMock, $oValidatorMock);
        $aHotels = $oService->getResultForCityId(15475);

        $this->assertInternalType('array', $aHotels);
        $this->assertEquals(0, count($aHotels));
    }

    /**
     * @expectedException \Task\Application\Exception\NoDataException
     */
    public function testShouldThrowNoDataException()
    {
        $oDataSourceMock = $this->getMockBuilder('Task\Application\Service\DataSourceService\JsonDataSourceService')
            ->disableOriginalConstructor()
            ->setMethods(array('collectDataById'))
            ->getMock();

        $oDataSourceMock->expects($this->once())
                        ->method('collectDataById')
                        ->will($this->returnValue(null));

        /** @var Normalizer $oNormalizerMock */
        $oNormalizerMock = $this->getMock('Task\Application\Entity\Normalizer\Normalizer');
        /** @var Validator $oValidatorMock */
        $oValidatorMock = $this->getMock('Task\Application\Entity\Validator\Validator');

        /** @var JsonDataSourceService $oDataSourceMock */
        $oService = new MyPartnerService($oDataSourceMock, $oNormalizerMock, $oValidatorMock);

        $oService->getResultForCityId(0);
    }


}