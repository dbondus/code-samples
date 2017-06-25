define([
    'backbone'
], function(Backbone) {
    "use strict";

    /**
     * @typedef RouteConfigData
     * @type {object}
     * @property {string} name
     * @property {Function} view
     */
    var RouteConfigData;

    /**
     * @class
     * @mixes Backbone.Events
     * @classdesc Route manager
     */
    var Router = Backbone.Router.extend(
        /** @lends Router.prototype */
        {

        /** @type Mediator */
        mediator: null,

        /**
         * Injects mediator instance
         *
         * @param {Mediator} mediator
         */
        setMediator: function(mediator) {
            this.mediator = mediator;
        },

        /**
         * Applies external route config
         *
         * @param {Object.<string, RouteConfigData>} routes Route pattern => route config
         * @returns {Router}
         */
        setRoutes: function(routes) {
            this.routes = routes;

            this._bindRoutes();

            return this;
        },

        /**
         * Starts watching browser address
         *
         * @returns {Router}
         */
        watch: function() {
            this._addListeners();
            
            Backbone.history.start({
                pushState: true
            });

            return this;
        },

        /**
         * Registers route handler
         *
         * @param {string} route Route pattern
         * @param {RouteConfigData} routeConfig
         * @returns {Router}
         *
         * @fires Mediator~EVENT_ROUTE_CHANGE
         */
        route: function(route, routeConfig) {
            var mediator = this.mediator;

            return Backbone.Router.prototype.route.call(this, route, routeConfig.name, function() {
                mediator.trigger(mediator.EVENT_ROUTE_CHANGE, {
                    routeName: routeConfig.name,
                    boundView: routeConfig.view,
                    boundViewArguments: arguments
                });
            });
        },

        /**
         * @private
         */
        _addListeners: function() {
            this.mediator.on(this.mediator.EVENT_NAVIGATE, this._onApplicationNavigate, this);
        },

        /**
         * Handler of application's request to change route
         *
         * @param {Mediator~event:EVENT_NAVIGATE} event
         * @listens Mediator~event:EVENT_NAVIGATE
         */
        _onApplicationNavigate: function(event) {
            if (!event) {
                return;
            }

            this.navigate(event.target, event.options);

            //remove this to leave browser address bar changed (to preserve user location between page reloads)
            this.navigate('/', {
                trigger: false,
                replace: false
            });
        }
    });

    return Router;
});
