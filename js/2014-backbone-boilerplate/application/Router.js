define([
    'backbone',

    'services/mediatorService'
], function (Backbone, mediator) {
    return Backbone.Router.extend({
        setRoutes: function (routes) {
            this.routes = routes;

            this._bindRoutes();
        },

        start: function () {
            Backbone.history.start({
                pushState: true
            });
        },

        initialize: function () {
            mediator.on(mediator.EVENT_NAVIGATE, function (event) {
                this.navigate(event.target, event.options);
            }, this);
        },

        route: function (route, routeConfig) {
            return Backbone.Router.prototype.route.call(this, route, routeConfig.name, function () {
                var userType = 'guest',
                    hasAccess = routeConfig.permissions
                        ? routeConfig.permissions.indexOf(userType) >= 0
                        : true;

                if (hasAccess) {
                    mediator.trigger(mediator.EVENT_VIEW_CHANGE, routeConfig.view, arguments);

                    return;
                }

                console.log('access denied');
            });
        }
    });
});
