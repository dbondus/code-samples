<?php

namespace Task\FeedbackBundle;

use Task\FeedbackBundle\DependencyInjection\Compiler\AddProcessorsPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class TaskFeedbackBundle extends Bundle {

    public function build(ContainerBuilder $container) {
        parent::build($container);

        $container->addCompilerPass(new AddProcessorsPass());
    }
}