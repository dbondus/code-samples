<?php

namespace Task\FeedbackBundle\Tests\Controller;

use Doctrine\ORM\EntityManager;
use Task\FeedbackBundle\Entity\Feedback;
use Task\FeedbackBundle\Entity\FeedbackAuthor;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class FeedbackControllerTest extends WebTestCase
{

    public function testIndex()
    {
        $client = static::createClient();
        $container = $client->getContainer();

        $client->request('GET', '/feedback/fg');
        $this->assertEquals(200, $client->getResponse()->getStatusCode(), 'invalid request response code');

        $resp = json_decode($client->getResponse()->getContent(), true);
        $this->assertTrue(isset($resp['feedbackId']), 'no feedback id in response');

        //ToDo: remove stub and add request params
        $feedbackData = [
            'branch' => '123',
            'authorPhone' => '11111111111',
            'authorEmail' => 'sender@example.com',
            'branchEmail' => '123@test.com.ua',
            'content' => 'Тело письма с содержанием жалобы в формате text',
        ];

        /** @var EntityManager $em */
        $em = $container->get('doctrine.orm.entity_manager');

        /** @var Feedback $feedback */
        $feedback = $em->getRepository('TaskFeedbackBundle:Feedback')->findOneById($resp['feedbackId']);
        $this->assertTrue($feedback instanceof Feedback, 'feedback entity not found');

        $this->assertEquals($feedback->getContent(), $feedbackData['content'], 'invalid feedback content');
        $this->assertEquals($feedback->getBranchID(), $feedbackData['branch'], 'invalid feedback branch id');

        /** @var FeedbackAuthor $author */
        $author = $em->getRepository('TaskFeedbackBundle:FeedbackAuthor')->findOneByPhone($feedbackData['authorPhone']);
        $this->assertTrue($author instanceof FeedbackAuthor, 'feedback author not found');

        $em->remove($feedback);
        $em->remove($author);
        $em->flush();
    }
}