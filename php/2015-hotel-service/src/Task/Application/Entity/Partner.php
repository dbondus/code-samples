<?php

namespace Task\Application\Entity;

use Task\Application\Entity\Collection\PriceCollection;

/**
 * Represents a single partner from a search result.
 *
 * @author mmueller
 */
class Partner extends BaseEntity
{
    protected $aFieldMapping = array(
        'sName' => 'name',
        'sHomepage' => 'url',
        'oPrices' => 'prices'
    );

    protected $aValidationRules = array(
        'sHomepage' => array(
            'constraint' => 'regex:/^http:\/\//',
            'message' => 'Homepage URL is invalid'
        )
    );

    /**
     * Name of the partner
     * @var string
     */
    public $sName;

    /**
     * Url of the partner's homepage (root link)
     *
     * @var string
     */
    public $sHomepage;

    /**
     * Unsorted list of prices received from the
     * actual search query.
     *
     * @var PriceCollection
     */
    public $oPrices = null;

    public function __construct(array $oData = null)
    {
        $this->oPrices = new PriceCollection();
    }

}