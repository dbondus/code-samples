<?php

namespace Task\Application\Entity;

use Task\Application\Entity\Collection\PartnerCollection;

/**
 * Represents a single hotel in the result.
 *
 * @author mmueller
 */
class Hotel extends BaseEntity
{
    protected $aFieldMapping = array(
        'sName' => 'name',
        'sAdr' => 'adr',
        'oPartners' => 'partners',
    );

    protected $aValidationRules = array(
        'sName' => array(
            'constraint' => 'method:validateName',
            'message' => 'Name is invalid'
        )
    );

    /**
     * Name of the hotel.
     *
     * @var string
     */
    public $sName;

    /**
     * Street adr. of the hotel.
     *
     * @var string
     */
    public $sAdr;

    /**
     * Unsorted list of partners with their corresponding prices.
     *
     * @var PartnerCollection
     */
    public $oPartners = null;

    public function __construct()
    {
        $this->oPartners = new PartnerCollection();
    }

    public function validateName($sName)
    {
        return strpos($sName, 'Nord') !== false;
    }
}