<?php

namespace Task\FeedbackBundle\Service;

use InvalidArgumentException;
use Task\FeedbackBundle\Event\FeedbackEvent;
use Task\FeedbackBundle\FeedbackEvents;
use Symfony\Component\EventDispatcher\EventDispatcher;

class FeedbackHandler
{
    /**
     * @var IFeedbackProcessor[]
     */
    protected $_processors = [];

    /**
     * @var EventDispatcher
     */
    protected $_eventDispatcher;

    /**
     * @param EventDispatcher $eventDispatcher
     */
    function __construct(EventDispatcher $eventDispatcher)
    {
        $this->_eventDispatcher = $eventDispatcher;
    }

    /**
     * @param IFeedbackProcessor $processor
     * @param string $type feedback type
     * @throws InvalidArgumentException
     */
    public function addProcessor(IFeedbackProcessor $processor, $type)
    {
        if (isset($this->_processors[$type])) {
            throw new InvalidArgumentException("You have already set processor for '{$type}' feedback type");
        }

        $this->_processors[$type] = $processor;
    }

    /**
     * @param array $data
     * @param string $type
     * @throws InvalidArgumentException
     * @return int new feedback id
     */
    public function handle(array $data, $type)
    {
        if (empty($this->_processors[$type])) {
            throw new InvalidArgumentException("Unknown feedback type: '{$type}'");
        }

        /**
         * IFeedbackProcessor
         */
        $processor = $this->_processors[$type];
        $feedback = $processor->process($data);

        $this->_eventDispatcher->dispatch(FeedbackEvents::FEEDBACK_NEW, new FeedbackEvent($feedback));

        return $feedback->getID();
    }
}