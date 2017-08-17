<?php

namespace Task\FeedbackBundle\Service\FeedbackProcessor\EmailFeedbackProcessor;

use Task\FeedbackBundle\Service\FeedbackProcessor\EmailFeedbackProcessor;

class QRFeedbackProcessor extends EmailFeedbackProcessor
{
    protected $_type = 'FEEDBACK_TYPE_QR';
}