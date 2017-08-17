<?php

namespace Task\Application\Entity;

class BaseEntity
{
    protected $aFieldMapping = array();
    protected $aValidationRules = array();

    /**
     * @var integer
     */
    public $iId;

    /**
     * Used by Normalizer
     *
     * Example
     * array(
     *   'sSomeField' =>'someFieldName',
     *
     *   'sSomeField' => array(
     *      'name' => 'someFieldName',
     *      'initializer' => 'methodName'
     *      'formatter' => 'methodName'
     *   ),
     *   ....
     * )
     *
     * @return array
     */
    public function getFieldMapping()
    {
        return $this->aFieldMapping;
    }

    /**
     * Used by Validator
     *
     * Example
     * array(
     *   'sSomeField' => array(
     *      'constraint' => 'regex:/^http:\/\//',
     *      'message' => 'error message'
     *   ),
     *
     *   'sSomeField2' => array(
     *      'constraint' => 'method:validationMethodName',
     *      'message' => 'Name is invalid'
     *    )
     * )
     *
     * @return array
     */
    public function getValidationRules()
    {
        return $this->aValidationRules;
    }

}