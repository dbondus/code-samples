<?php

namespace Task\FeedbackBundle\Service\FeedbackProcessor;

use Task\FeedbackBundle\Entity\FeedbackAuthor;
use Task\FeedbackBundle\Service\AFeedbackProcessor;

abstract class AAsteriskFeedbackProcessor extends AFeedbackProcessor {

    protected function _prepareFeedbackData($raw) {
        return array_merge(parent::_prepareFeedbackData($raw), [
            'feedbackAuthorID' => $this->_getOrCreateFeedbackAuthorByPhone($raw['authorPhone'])
        ]);
    }

    /**
     * @param string $authorPhone
     * @return int
     */
    protected function _getOrCreateFeedbackAuthorByPhone($authorPhone) {
        /**
         * @var FeedbackAuthor $author
         */
        if ($author = $this->_em->getRepository('TaskFeedbackBundle:FeedbackAuthor')->findOneByPhone($authorPhone)) {
            return $author->getID();
        }

        $author = $this->_createFeedbackAuthor('phone', $authorPhone);

        return $author->getID();
    }
}