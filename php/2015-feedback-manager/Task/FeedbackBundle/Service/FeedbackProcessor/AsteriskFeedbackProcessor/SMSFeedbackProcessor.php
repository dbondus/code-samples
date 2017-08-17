<?php

namespace Task\FeedbackBundle\Service\FeedbackProcessor\AsteriskFeedbackProcessor;

use Task\FeedbackBundle\Service\FeedbackProcessor\AAsteriskFeedbackProcessor;

class SMSFeedbackProcessor extends AAsteriskFeedbackProcessor
{
    protected $_type = 'FEEDBACK_TYPE_SMS';
}