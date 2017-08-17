<?php

namespace Task\FeedbackBundle\DependencyInjection\Compiler;

use InvalidArgumentException;
use ReflectionClass;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

class AddProcessorsPass implements CompilerPassInterface
{

    public function process(ContainerBuilder $container)
    {
        if (!$container->hasDefinition('task.feedback.handler')) {
            return;
        }

        $definition = $container->getDefinition('task.feedback.handler');

        foreach ($container->findTaggedServiceIds('task.feedback.processor') as $id => $attrs) {
            $attrs = $attrs[0];

            $refClass = new ReflectionClass($container->getDefinition($id)->getClass());
            if (!$refClass->implementsInterface('Task\FeedbackBundle\Service\IFeedbackProcessor')) {
                throw new InvalidArgumentException("Service '{$id}' must implement interface 'Task\\FeedbackBundle\\ServiceIFeedbackProcessor'.");
            }

            if (empty($attrs['type'])) {
                throw new InvalidArgumentException("You should define feedback type of service '{$id}'");
            }

            $definition->addMethodCall('addProcessor', [new Reference($id), $attrs['type']]);
        }
    }
}