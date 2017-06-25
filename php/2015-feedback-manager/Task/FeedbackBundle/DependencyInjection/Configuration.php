<?php

namespace Task\FeedbackBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface {

    public function getConfigTreeBuilder() {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('task_feedback');

        $rootNode
            ->children()
                ->booleanNode('log')
                    ->info('feedback event logging')
                    ->defaultFalse()
                ->end()
                ->arrayNode('table_mapping')
                    ->info('custom entity table names')
                    ->canBeEnabled()
                    ->children()
                        ->scalarNode('feedback')
                            ->info('db table name to store incoming feedbacks')
                            ->defaultNull()
                        ->end()
                        ->scalarNode('author')
                            ->info('db table name to store feedback authors')
                            ->defaultNull()
                        ->end()
                        ->scalarNode('log')
                            ->info('db table name to log various feedback events')
                            ->defaultNull()
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}