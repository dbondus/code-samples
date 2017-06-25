define([
    'lib/Router',

    'services/mediator'
], function(Router, mediator) {
    "use strict";

    var router = new Router();
    router.setMediator(mediator);

    return router;
});
