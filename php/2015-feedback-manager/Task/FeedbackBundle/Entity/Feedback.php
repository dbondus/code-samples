<?php

namespace Task\FeedbackBundle\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Feedback
 *
 * @ORM\Table(name="feedback")
 * @ORM\Entity
 */
class Feedback
{
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
     * @ORM\Column(name="branch_id", type="integer", nullable=false)
     */
    private $branchID;

    /**
     * @var integer
     *
     * @ORM\Column(name="feedback_author_id", type="integer", nullable=false)
     */
    private $feedbackAuthorID;

    /**
     * @var integer
     *
     * @ORM\Column(name="feedback_tag_id", type="integer", nullable=true)
     */
    private $feedbackTagID;

    /**
     * @var integer
     *
     * @ORM\Column(name="duration", type="integer", nullable=true)
     */
    private $duration;

    /**
     * @var string
     *
     * @ORM\Column(name="feedback_type", type="string")
     */
    private $feedbackType;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="created_date", type="datetime")
     */
    private $createdDate;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="updated_date", type="datetime", nullable=true)
     * @Assert\NotBlank(groups={"autoAnswer", "manualAnswer"})
     * @Assert\DateTime(groups={"autoAnswer", "manualAnswer"})
     */
    private $updatedDate;

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text", nullable=false)
     */
    private $content;

    /**
     * @var bool
     *
     * @ORM\Column(name="auto_answer_sent", type="boolean", nullable=true)
     * @Assert\NotBlank(groups={"autoAnswer"})
     * @Assert\Type(type="bool", groups={"autoAnswer"})
     */
    private $autoAnswer;

    /**
     * @var string
     *
     * @ORM\Column(name="answer_text", type="text", nullable=true)
     * @Assert\NotBlank(groups={"manualAnswer"})
     */
    private $answerText;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="answer_date", type="datetime", nullable=true)
     * @Assert\NotBlank(groups={"autoAnswer", "manualAnswer"})
     * @Assert\DateTime(groups={"autoAnswer", "manualAnswer"})
     */
    private $answerDate;

    /**
     * @var integer
     *
     * @ORM\Column(name="answer_account_id", type="integer", nullable=true)
     * @Assert\NotBlank(groups={"autoAnswer", "manualAnswer"})
     * @Assert\Type(type="integer", groups={"autoAnswer", "manualAnswer"})
     */
    private $answerAccountID;

    /**
     * @return int
     */
    public function getID()
    {
        return $this->id;
    }

    /**
     * @param int $branchID
     */
    public function setBranchID($branchID)
    {
        $this->branchID = $branchID;
    }

    /**
     * @return int
     */
    public function getBranchID()
    {
        return $this->branchID;
    }

    /**
     * @param string $content
     */
    public function setContent($content)
    {
        $this->content = $content;
    }

    /**
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @param DateTime $createdDate
     */
    public function setCreatedDate($createdDate)
    {
        $this->createdDate = $createdDate;
    }

    /**
     * @return DateTime
     */
    public function getCreatedDate()
    {
        return $this->createdDate;
    }

    /**
     * @param int $duration
     */
    public function setDuration($duration)
    {
        $this->duration = $duration;
    }

    /**
     * @return int
     */
    public function getDuration()
    {
        return $this->duration;
    }

    /**
     * @param int $feedbackTagID
     */
    public function setFeedbackTagID($feedbackTagID)
    {
        $this->feedbackTagID = $feedbackTagID;
    }

    /**
     * @return int
     */
    public function getFeedbackTagID()
    {
        return $this->feedbackTagID;
    }

    /**
     * @param string $feedbackType
     */
    public function setFeedbackType($feedbackType)
    {
        $this->feedbackType = $feedbackType;
    }

    /**
     * @return string
     */
    public function getFeedbackType()
    {
        return $this->feedbackType;
    }

    /**
     * @param int $feedbackAuthorID
     */
    public function setFeedbackAuthorID($feedbackAuthorID)
    {
        $this->feedbackAuthorID = $feedbackAuthorID;
    }

    /**
     * @return int
     */
    public function getFeedbackAuthorID()
    {
        return $this->feedbackAuthorID;
    }

    /**
     * @param int $updatedDate
     */
    public function setUpdatedDate($updatedDate)
    {
        $this->updatedDate = $updatedDate;
    }

    /**
     * @return int
     */
    public function getUpdatedDate()
    {
        return $this->updatedDate;
    }

    /**
     * @param boolean $autoAnswer
     */
    public function setAutoAnswer($autoAnswer)
    {
        $this->autoAnswer = $autoAnswer;
    }

    /**
     * @return boolean
     */
    public function getAutoAnswer()
    {
        return $this->autoAnswer;
    }

    /**
     * @param int $answerAccountID
     */
    public function setAnswerAccountID($answerAccountID)
    {
        $this->answerAccountID = $answerAccountID;
    }

    /**
     * @return int
     */
    public function getAnswerAccountID()
    {
        return $this->answerAccountID;
    }

    /**
     * @param string $answerText
     */
    public function setAnswerText($answerText)
    {
        $this->answerText = $answerText;
    }

    /**
     * @return string
     */
    public function getAnswerText()
    {
        return $this->answerText;
    }

    /**
     * @param DateTime $answerDate
     */
    public function setAnswerDate($answerDate)
    {
        $this->answerDate = $answerDate;
    }

    /**
     * @return DateTime
     */
    public function getAnswerDate()
    {
        return $this->answerDate;
    }
}