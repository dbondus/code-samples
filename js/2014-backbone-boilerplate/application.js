require([
    'views/Layout',

    'services/routerService',
    'configs/routes',

    'utils/promise'
], function (Layout, router, routes) {
    "use strict";

    new Layout({el: 'body'}).render();

    router.setRoutes(routes);
    router.start();
});
