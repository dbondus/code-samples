<?php
namespace Task\FeedbackBundle\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * FeedbackLogRecord
 *
 * @ORM\Table(name="feedback_log")
 * @ORM\Entity
 */
class FeedbackLogRecord {

    /**
     * @var integer
     *
     * @ORM\Id @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="feedback_id", type="integer", nullable=false)
     */
    private $feedbackID;

    /**
     * @var integer
     *
     * @ORM\Column(name="branch_id", type="integer", nullable=true)
     */
    private $branchID;

    /**
     * @var integer
     *
     * @ORM\Column(name="account_id", type="integer", nullable=true)
     */
    private $accountID;

    /**
     * @var string
     *
     * @ORM\Column(name="feedback_event_type", type="string")
     */
    private $feedbackEventType;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="created_date", type="datetime")
     */
    private $createdDate;

    /**
     * @param int $accountID
     */
    public function setAccountID($accountID) {
        $this->accountID = $accountID;
    }

    /**
     * @return int
     */
    public function getAccountID() {
        return $this->accountID;
    }

    /**
     * @param int $branchID
     */
    public function setBranchID($branchID) {
        $this->branchID = $branchID;
    }

    /**
     * @return int
     */
    public function getBranchID() {
        return $this->branchID;
    }

    /**
     * @param DateTime $createdDate
     */
    public function setCreatedDate($createdDate) {
        $this->createdDate = $createdDate;
    }

    /**
     * @return int
     */
    public function getID() {
        return $this->id;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedDate() {
        return $this->createdDate;
    }

    /**
     * @param string $feedbackEventType
     */
    public function setFeedbackEventType($feedbackEventType) {
        $this->feedbackEventType = $feedbackEventType;
    }

    /**
     * @return string
     */
    public function getFeedbackEventType() {
        return $this->feedbackEventType;
    }

    /**
     * @param int $feedbackID
     */
    public function setFeedbackID($feedbackID) {
        $this->feedbackID = $feedbackID;
    }

    /**
     * @return int
     */
    public function getFeedbackID() {
        return $this->feedbackID;
    }
}