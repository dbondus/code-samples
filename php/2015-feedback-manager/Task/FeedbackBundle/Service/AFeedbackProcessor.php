<?php

namespace Task\FeedbackBundle\Service;

use DateTime;
use Doctrine\ORM\EntityManager;
use Task\FeedbackBundle\Entity\Feedback;
use Task\FeedbackBundle\Entity\FeedbackAuthor;
use Task\FeedbackBundle\Util\EntityUtils;

abstract class AFeedbackProcessor implements IFeedbackProcessor
{
    /**
     * @var string
     */
    protected $_type;

    /**
     * @var EntityManager
     */
    protected $_em;

    public function __construct(EntityManager $em)
    {
        $this->_em = $em;
    }

    /**
     * @param array $inputData
     * @return Feedback
     */
    public function process(array $inputData)
    {
        $feedbackData = $this->_prepareFeedbackData($inputData);

        return $this->_createFeedback($feedbackData);
    }

    /**
     * @param string $key
     * @param string $value
     * @return FeedbackAuthor
     */
    protected function _createFeedbackAuthor($key, $value)
    {
        /** @var FeedbackAuthor $author */
        $author = EntityUtils::array2entity([
            $key => $value,
            'createdDate' => new DateTime("now")
        ], new FeedbackAuthor());

        $this->_em->persist($author);
        $this->_em->flush($author);

        return $author;
    }

    /**
     * @param array $feedbackData
     * @return Feedback
     */
    protected function _createFeedback(array $feedbackData)
    {
        /** @var Feedback $feedback */
        $feedback = EntityUtils::array2entity($feedbackData, new Feedback());

        $this->_em->persist($feedback);
        $this->_em->flush($feedback);

        return $feedback;
    }

    /**
     * prepare array for Feedback entity
     *
     * @param array $raw
     * @return array
     */
    protected function _prepareFeedbackData($raw)
    {
        // TODO: branch_id exists

        return [
            'branchID' => $raw['branch'],

            'createdDate' => new DateTime("now"),
            'content' => $raw['content'],

            'feedbackType' => $this->_type
        ];
    }
} 