<?php

namespace Task\FeedbackBundle\Service\FeedbackProcessor;

use Task\FeedbackBundle\Entity\FeedbackAuthor;
use Task\FeedbackBundle\Service\AFeedbackProcessor;

class EmailFeedbackProcessor extends AFeedbackProcessor
{

    protected $_type = 'FEEDBACK_TYPE_EMAIL';

    protected function _prepareFeedbackData($raw)
    {
        return array_merge(parent::_prepareFeedbackData($raw), [
            'feedbackAuthorID' => $this->_getOrCreateFeedbackAuthorByEmail($raw['authorEmail'])
        ]);
    }

    /**
     * @param string $authorEmail
     * @return int
     */
    protected function _getOrCreateFeedbackAuthorByEmail($authorEmail)
    {
        /**
         * @var FeedbackAuthor $author
         */
        if ($author = $this->_em->getRepository('TaskFeedbackBundle:FeedbackAuthor')->findOneByEmail($authorEmail)) {
            return $author->getID();
        }

        $author = $this->_createFeedbackAuthor('email', $authorEmail);

        return $author->getID();
    }
}