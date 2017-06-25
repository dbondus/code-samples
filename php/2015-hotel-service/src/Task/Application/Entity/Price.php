<?php

namespace Task\Application\Entity;
use DateTime;

/**
 * Represents a single price from a search result
 * related to a single partner.
 * 
 * @author mmueller
 */
class Price extends BaseEntity
{
    protected $aFieldMapping = array(
        'sDescription' => 'description',
        'fAmount' => 'amount',
        'oFromDate' => array(
            'name' => 'from',
            'initializer' => 'string2DateTime'
        ),
        'oToDate' => array(
            'name' => 'to',
            'initializer' => 'string2DateTime'
        )
    );

    /**
     * Description text for the rate/price
     * 
     * @var string
     */
    public $sDescription;

    /**
     * Price in euro
     * 
     * @var float
     */
    public $fAmount;

    /**
     * Arrival date, represented by a DateTime obj
     * which needs to be converted from a string on 
     * write of the property.
     *
     * @var DateTime
     */
    public $oFromDate;

    /**
     * Departure date, represented by a DateTime obj
     * which needs to be converted from a string on 
     * write of the property
     *
     * @var DateTime
     */
    public $oToDate;

    public function string2DateTime($sValue)
    {
        return new DateTime($sValue);
    }
}
