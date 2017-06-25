<?php

namespace Task\FeedbackBundle\Service;

use DateTime;
use Doctrine\ORM\EntityManager;
use Task\FeedbackBundle\Entity\FeedbackLogRecord;
use Task\FeedbackBundle\Util\EntityUtils;

class FeedbackLogger {
    /**
     * @var EntityManager
     */
    protected $_em;
    /**
     * @param EntityManager $em
     */
    function __construct(EntityManager $em) {
        $this->_em = $em;
    }

    /**
     * @param int $feedbackID
     * @param int $branchID
     * @param string $type
     * @return int
     */
    public function log($feedbackID, $branchID, $type) {
        /** @var FeedbackLogRecord $feedbackLog */
        $feedbackLog = EntityUtils::array2entity([
            'feedbackID' => $feedbackID,
            'branchID' => $branchID,
            'feedbackEventType' => $type,
            'createdDate' => new DateTime("now")
        ], new FeedbackLogRecord());

        $this->_em->persist($feedbackLog);
        $this->_em->flush($feedbackLog);

        return $feedbackLog->getID();
    }
}

//TODO: Send notification about new feedback to the manager of this branch
//TODO: Send notification to the feedback's author, by Phone or Email