require([
    'services/router',
    'configs/routes',

    'services/chatClient',

    'views/Layout'
], function(router, routes, chatClient, Layout) {
    "use strict";

    //this is main view instance. It manages live circle of screens(major view)
    new Layout({
        el: 'body'
    }).render();

    chatClient.connect();

    router
        .setRoutes(routes)
        .watch();
});
