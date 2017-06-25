<?php

namespace Task\FeedbackBundle;

final class FeedbackEvents {
    /**
     * The task.feedback.new event is thrown each time an feedback data is received by the system
     * The event listener receives an Task\FeedbackBundle\Event\FeedbackEvent instance with raw feedback data
     *
     * @var string
     */
    const FEEDBACK_NEW = 'task.feedback.new';
}