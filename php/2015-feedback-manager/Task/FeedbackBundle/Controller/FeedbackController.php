<?php

namespace Task\FeedbackBundle\Controller;

use Task\FeedbackBundle\Service\FeedbackHandler;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class FeedbackController {
    /**
     * @var FeedbackHandler
     */
    protected $_handler;

    function __construct(FeedbackHandler $handler) {
        $this->_handler = $handler;
    }

    /**
     * @param string $type
     * @return Response
     */
    public function handleAction($type) {
        $feedbackId = $this->_handler->handle([
            'branch' => '123',
            'authorPhone' => '11111111111',
            'authorEmail' => 'sender@example.com',
            'branchEmail' => '123@test.com.ua',
            'content' => 'complain text',
        ], $type);

        return new JsonResponse(['feedbackId' => $feedbackId]);
    }
}