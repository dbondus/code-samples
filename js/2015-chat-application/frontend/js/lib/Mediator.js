define([
    'lib/Events',
    'underscore'
], function (Events, _) {
    "use strict";

    /**
     * @class
     * @classdesc Central application mediator. Connects different application parts
     */
    var Mediator = function () {
    };

    _.extend(Mediator.prototype, Events,
        /** @lends Mediator.prototype */
        {
            /**
             * Shortcut for route based navigation
             *
             * @param {string} location new value for the browser address bar
             * @param {boolean} [triggerRoute] to trigger function bound to a specific route
             * @param {boolean} [replaceHistoryEntry] to replace current browser history entry
             * @fires Mediator~EVENT_NAVIGATE
             */
            navigate: function (location, triggerRoute, replaceHistoryEntry) {
                this.trigger(this.EVENT_NAVIGATE, {
                    target: location,
                    options: {
                        trigger: triggerRoute,
                        replace: replaceHistoryEntry
                    }
                });
            },

            /**
             * Try to load different route without browser's page reloading
             *
             * @event Mediator#EVENT_NAVIGATE
             * @type {object}
             * @property {string} target
             * @property {{trigger: boolean, replace: boolean}} options
             */
            EVENT_NAVIGATE: 'navigate',

            /**
             * Change current screen to the bound one
             *
             * @event Mediator#EVENT_ROUTE_CHANGE
             * @type {object}
             * @property {string} routeName
             * @property {View|Function} boundView
             * @property {object[]} [boundViewArguments]
             */
            EVENT_ROUTE_CHANGE: 'route_change',

            /**
             * Incoming chat message event
             *
             * @event Mediator#EVENT_CHAT_MESSAGE_INCOMING
             * @type {object}
             * @property {number} amount
             */
            EVENT_CHAT_MESSAGE_INCOMING: 'message_incoming',

            /**
             * Send new chat message to server
             *
             * @event Mediator#COMMAND_CHAT_MESSAGE_SEND
             * @type {MessageData}
             */
            COMMAND_CHAT_MESSAGE_SEND: 'message_send',

            /**
             * Collect all received messages
             *
             * @event Mediator#COMMAND_CHAT_MESSAGES_GET
             * @type {object}
             * @property {Function} done
             * @property {object} context
             */
            COMMAND_CHAT_MESSAGES_GET: 'messages_get',

            /**
             * Collect recent messages
             *
             * @event Mediator#COMMAND_CHAT_MESSAGES_COLLECT_NEW
             * @type {object}
             * @property {Function} done
             * @property {object} context
             */
            COMMAND_CHAT_MESSAGES_COLLECT_NEW: 'messages_collect_new'
        });

    return Mediator;
});
