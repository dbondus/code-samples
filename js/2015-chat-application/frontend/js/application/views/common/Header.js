define([
    'views/base/View',

    'services/mediator',

    'views/helpers/Blinker',

    'text!./_tmpl/Header.html'
], function(BaseView, mediator, Blinker, tmplData) {
    "use strict";

     /**
     * @class
     * @extends View
     * @classdesc Header view
     */
    var Header = BaseView.extend(
        /** @lends Header.prototype */
        {
        /**
         *@override
         */
        name: 'headerView',
        /**
         *@override
         */
        template: tmplData,
        /**
         *@override
         */
        tagName: 'nav',

        /**
         *@override
         */
        events: {
            'click .e-nav-chat': function() {
                this._navigateTo('chat');
            },
            'click .e-nav-photos': function() {
                this._navigateTo('photos');
            },
            'click .e-nav-settings': function() {
                this._navigateTo('settings');
            }
        },

        /**
         * @type {Blinker|Function}
         */
        blinker: Blinker,

        activeTabClass: 'active',

        /**
         * @type {?string} Current active route
         */
        routeName: null,

        /**
         * @type {object.<string, string>} Route name to tab class mapping
         */
        route2tab: {
            chat: '.e-nav-chat',
            photos: '.e-nav-photos',
            settings: '.e-nav-settings'
        },

        /**
         * @param {{activeTabClass: string}} [options]
         * @override
         */
        initialize: function(options) {
            options || (options = {});

            BaseView.prototype.initialize.call(this, options);

            options.activeTabClass && (this.activeTabClass = options.activeTabClass);
        },

        /**
         * Renders view and instantiates Blinker
         * @override
         */
        render: function() {
            BaseView.prototype.render.call(this);

            this._addEventListeners();

            this.blinker = new this.blinker(
                this.$('.e-nav-chat'),
                this.$('.e-message-amount'), {
                    blinkClass: 'ca-blink'
                }
            );

            return this;
        },

        /**
         * Changes current route, updates tab UI ant triggers corresponding handler
         *
         * @param {Mediator~event:EVENT_ROUTE_CHANGE} event
         */
         setRoute: function(event) {
            var routeName = event.routeName;

            if(!routeName) {
                return;
            }

            this._updateNavigationTabs(routeName);

            this.routeName = routeName;

            var routeHandlerMethod = 'route_' + this.routeName;
            this[routeHandlerMethod] || (routeHandlerMethod = 'route_default');
            this[routeHandlerMethod]();
        },

        /**
         * Handler for char route
         */
        route_chat: function() {
            if(this.blinker.isBlinking) {
                this.blinker.updateMessageCounter(0);

                this.blinker.stopBlinking();
            }

            this.blinker.toggleLock();
        },

        /**
         * Default route handler
         */
        route_default: function() {
            this.blinker.toggleLock();
        },

        _addEventListeners: function() {
            this.listenTo(mediator, mediator.EVENT_CHAT_MESSAGE_INCOMING, this._onNewMessage);
            this.listenTo(mediator, mediator.EVENT_ROUTE_CHANGE, this.setRoute);
        },

        /**
         * @param {Mediator~event:EVENT_CHAT_MESSAGE_INCOMING} event
         * @listens Mediator~event:EVENT_CHAT_MESSAGE_INCOMING
         * @private
         */
        _onNewMessage: function(event) {
            this.blinker.updateMessageCounter(event.amount);

            this.blinker.isBlinking || this.blinker.startBlinking();
        },

        /**
         * Updates tab UI
         * @param {string} routeName
         * @private
         */
        _updateNavigationTabs: function(routeName) {
            if(this.routeName === routeName) {
                return;
            }

            this.routeName && this._getTabByRoute(this.routeName).removeClass(this.activeTabClass);

            this._getTabByRoute(routeName).addClass(this.activeTabClass);
        },

        /**
         * Get tab element from mapping
         *
         * @param {string} routeName
         * @returns {jQuery}
         * @private
         */
        _getTabByRoute: function(routeName) {
            return this.$(this.route2tab[routeName]);
        },

        /**
         * Shortcut for changing of the screen
         *
         * @param {string} url
         * @private
         */
        _navigateTo: function(url) {
            this.mediator.navigate(url, true);
        }
    });

    return Header;
});
