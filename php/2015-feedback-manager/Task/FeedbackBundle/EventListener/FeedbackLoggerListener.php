<?php

namespace Task\FeedbackBundle\EventListener;

use Task\FeedbackBundle\Entity\Feedback;
use Task\FeedbackBundle\Event\FeedbackEvent;
use Task\FeedbackBundle\Service\FeedbackLogger;

class FeedbackLoggerListener {
    private $_logger;

    function __construct(FeedbackLogger $logger) {
        $this->_logger = $logger;
    }

    public function onNewFeedback(FeedbackEvent $event) {
        /** @var Feedback $feedback */
        $feedback = $event->data;
        $this->_logger->log($feedback->getID(), $feedback->getBranchID(), 'FBE_TYPE_NEW');
    }
}