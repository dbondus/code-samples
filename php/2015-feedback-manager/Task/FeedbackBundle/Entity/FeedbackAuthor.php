<?php
namespace Task\FeedbackBundle\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * FeedbackAuthor
 *
 * @ORM\Entity
 * @ORM\Table(name="feedback_author")
 */
class FeedbackAuthor {
    /**
     * @var integer
     *
     * @ORM\Id @ORM\Column(type="integer")
     * @ORM\GeneratedValue
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(length=140, nullable=true)
     */
    private $phone;

    /**
     * @var string
     *
     * @ORM\Column(length=140, nullable=true)
     */
    private $email;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="created_date", type="datetime")
     */
    private $createdDate;


    /**
     * @return int
     */
    public function getID() {
        return $this->id;
    }

    /**
     * @param DateTime $createdDate
     */
    public function setCreatedDate($createdDate) {
        $this->createdDate = $createdDate;
    }

    /**
     * @return DateTime
     */
    public function getCreatedDate() {
        return $this->createdDate;
    }

    /**
     * @param string $phone
     */
    public function setPhone($phone) {
        $this->phone = $phone;
    }

    /**
     * @return string
     */
    public function getPhone() {
        return $this->phone;
    }

    /**
     * @param string $email
     */
    public function setEmail($email) {
        $this->email = $email;
    }

    /**
     * @return string
     */
    public function getEmail() {
        return $this->email;
    }
}