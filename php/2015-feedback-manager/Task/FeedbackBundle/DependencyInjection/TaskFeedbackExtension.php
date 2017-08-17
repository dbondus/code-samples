<?php

namespace Task\FeedbackBundle\DependencyInjection;

use Task\FeedbackBundle\FeedbackEvents;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\DependencyInjection\Reference;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\Config\FileLocator;

class TaskFeedbackExtension extends Extension
{

    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../Resources/config'));
        $loader->load('services.yml');

        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $config['log'] && $this->_setupLogger($container, $config);

        $this->_setupCustomTableMapping($container, $config);
    }

    public function getAlias()
    {
        return 'task_feedback';
    }

    private function _setupCustomTableMapping(ContainerBuilder $container, array $config)
    {
        $customTableMapping = [];

        $config['table_mapping']['feedback'] && ($customTableMapping['Task\FeedbackBundle\Entity\Feedback'] = $config['table_mapping']['feedback']);
        $config['table_mapping']['author'] && ($customTableMapping['Task\FeedbackBundle\Entity\FeedbackAuthor'] = $config['table_mapping']['author']);
        $config['table_mapping']['log'] && ($customTableMapping['Task\FeedbackBundle\Entity\FeedbackLogRecord'] = $config['table_mapping']['log']);

        if ($customTableMapping) {
            $def = $container->register('feedback.mapping.listener', 'Task\FeedbackBundle\EventListener\CustomEntityMappingListener');
            $def->setArguments([$customTableMapping]);
            $def->addTag('doctrine.event_listener', [
                'event' => 'loadClassMetadata'
            ]);
        }
    }

    private function _setupLogger(ContainerBuilder $container, array $config)
    {
        $def = $container->register('feedback.logger.listener', 'Task\FeedbackBundle\EventListener\FeedbackLoggerListener');
        $def->setArguments([new Reference('task.feedback.logger')]);
        $def->addTag('kernel.event_listener', [
            'event' => FeedbackEvents::FEEDBACK_CREATED,
            'method' => 'onNewFeedback'
        ]);

    }
}