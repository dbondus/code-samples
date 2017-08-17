<?php

namespace Task\FeedbackBundle\Service;

use Task\FeedbackBundle\Entity\Feedback;

interface IFeedbackProcessor
{

    /**
     * @param array $inputData
     * @return Feedback
     */
    function process(array $inputData);
}