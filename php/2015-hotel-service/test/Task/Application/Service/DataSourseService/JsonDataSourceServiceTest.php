<?php

namespace Task\Application\Service\DataSourceService;

use org\bovigo\vfs\vfsStream;
use org\bovigo\vfs\vfsStreamDirectory;

use PHPUnit_Framework_TestCase;

class JsonDataSourceServiceTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var vfsStreamDirectory
     */
    protected $vfsJsonDirectory;

    /**
     * @var string
     */
    protected $sStoragePath;

    /**
     * @var integer
     */
    protected $iValidCityId = 15476;

    protected function setUp()
    {
        vfsStream::setup('jsonDir');
        $this->vfsJsonDirectory = vfsStream::copyFromFileSystem(__DIR__ . '/../../../Fixtures/Cities');

        $this->sStoragePath = vfsStream::url('jsonDir') . DIRECTORY_SEPARATOR;
    }

    public function testShouldCollectCityDataArray()
    {
        $oService = new JsonDataSourceService($this->sStoragePath, 512);

        $aData = $oService->collectDataById($this->iValidCityId);

        $this->assertInternalType('array', $aData);
        $this->assertEquals(3, count($aData));
        $this->assertArrayHasKey('id', $aData);
        $this->assertArrayHasKey('city', $aData);
        $this->assertArrayHasKey('hotels', $aData);
        $this->assertInternalType('array', $aData['hotels']);
    }

    public function incorrectCityIdProvider()
    {
        return [
            [11],
            [1.2],
            ['a1233'],
            ['asdasd'],
            [null],
            [0],
            [false]
        ];
    }

    /**
     * @dataProvider incorrectCityIdProvider
     */
    public function testShouldReturnNullOnInvalidCityId($iCityId)
    {
        $oService = new JsonDataSourceService($this->sStoragePath, 512);

        $aData = $oService->collectDataById($iCityId);
        $this->assertNull($aData);
    }

    public function testShouldNotReturnCityDataArrayWithSmallMaxDepth()
    {
        $oService = new JsonDataSourceService($this->sStoragePath, 1);

        $aData = $oService->collectDataById($this->iValidCityId);
        $this->assertNull($aData);
    }
}