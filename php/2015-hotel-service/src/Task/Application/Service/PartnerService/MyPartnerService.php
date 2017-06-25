<?php

namespace Task\Application\Service\PartnerService;

use Task\Application\Entity\BaseEntity;
use Task\Application\Entity\Collection\BaseCollection;
use Task\Application\Entity\Collection\HotelCollection;
use Task\Application\Entity\Normalizer\Normalizer;
use Task\Application\Entity\Validator\Validator;
use Task\Application\Exception\NoDataException;
use Task\Application\Service\DataSourceService\DataSourceServiceInterface;

class MyPartnerService implements PartnerServiceInterface
{
    /**
     * @var DataSourceServiceInterface
     */
    protected $oDataSourceService;

    /**
     * @var Normalizer
     */
    protected $oNormalizer;

    /**
     * @var Validator
     */
    protected $oValidator;

    public function __construct(DataSourceServiceInterface $oDataSourceService, Normalizer $oNormalizer, Validator $oValidator)
    {
        $this->oNormalizer = $oNormalizer;
        $this->oValidator = $oValidator;
        $this->oDataSourceService = $oDataSourceService;
    }

    /**
     * @inheritdoc
     */
    public function getResultForCityId($iCityId)
    {
        /** @var array $aData */
        $aData = $this->oDataSourceService->collectDataById($iCityId);

        if(empty($aData) || !isset($aData['hotels'])) {
            throw new NoDataException(sprintf('Invalid city[%d] data', $iCityId));
        }

        $oHotels = new HotelCollection();
        $oHotels->denormalize($aData['hotels'], $this->oNormalizer);

        //drop invalid entity and stop processing its dependents
        $oHotels->validate($this->oValidator, function(BaseCollection $oCollection, $iInd, BaseEntity $oEntity, $sPropName, $sError) {
            unset($oCollection[$iInd]);

            return true;
        });

        return $oHotels->toArray();
    }
}