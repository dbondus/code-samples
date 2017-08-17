define([
    'underscore'
], function (_) {
    "use strict";

    var SERVER_EVENT_MESSAGE = 'message',
        SERVER_COMMAND_MESSAGE_SEND = 'message';

    /**
     * @typedef MessageData
     * @type {object}
     * @property {string} user
     * @property {string} message
     */
    var MessageData;

    /**
     * @class
     * @classdesc Designed to work in the background and communicate with the application through
     * mediator commands/events
     * @param {Mediator} mediator
     * @param {io} socketIO
     */
    var ChatClient = function (mediator, socketIO) {
        this.mediator = mediator;
        this.io = socketIO;

        this.initialize();
    };

    _.extend(ChatClient.prototype,
        /** @lends ChatClient.prototype */
        {
            /**
             * @type {MessageData[]}
             */
            newMessages: null,

            /**
             * @type {MessageData[]}
             */
            shownMessages: null,

            /** @type {io.Socket} */
            socket: null,

            /** @type {Mediator} */
            mediator: null,
            /** @type {io} */
            io: null,

            /**
             * @constructs
             */
            initialize: function () {
                this.newMessages = [];
                this.shownMessages = [];
            },

            /**
             * @param {string} [url]
             */
            connect: function (url) {
                this.socket = this.io.connect(url);

                this._addListeners();
            },

            /**
             * @returns {Array.<MessageData>}
             */
            getAllMessages: function () {
                this.collectRecentMessages();

                return this.shownMessages.slice();
            },

            /**
             *  Give back copy of recent messages and mark them as shown
             *
             * @returns {Array.<MessageData>}
             */
            collectRecentMessages: function () {
                var recent = this.newMessages.splice(0);
                this.shownMessages = this.shownMessages.concat(recent);

                return recent;
            },

            /**
             * @returns {Number}
             */
            getNewMessagesAmount: function () {
                return this.newMessages.length;
            },

            /**
             * @param {MessageData} data
             * @listens Mediator~event:COMMAND_CHAT_MESSAGE_SEND
             */
            sendMessage: function (data) {
                this.socket.emit(SERVER_COMMAND_MESSAGE_SEND, data);
            },

            /**
             * Connect listeners to the mediator and current active socket
             *
             * @private
             */
            _addListeners: function () {
                this._onMessage = _.bind(this._onMessage, this);

                this.socket.on(SERVER_EVENT_MESSAGE, this._onMessage);

                this.mediator.on(this.mediator.COMMAND_CHAT_MESSAGES_GET, this._commandGetAllMessages, this);
                this.mediator.on(this.mediator.COMMAND_CHAT_MESSAGES_COLLECT_NEW, this._commandCollectRecentMessages, this);

                this.mediator.on(this.mediator.COMMAND_CHAT_MESSAGE_SEND, this.sendMessage, this);
            },

            /**
             * Handler for receiving chat messages from server
             *
             * @param {MessageData} messageData
             * @fires Mediator~EVENT_CHAT_MESSAGE_INCOMING
             * @private
             */
            _onMessage: function (messageData) {
                this.newMessages.push(messageData);

                this.mediator.trigger(this.mediator.EVENT_CHAT_MESSAGE_INCOMING, {
                    amount: this.getNewMessagesAmount()
                });
            },

            /**
             * Handler for application command "GetAllMessages"
             *
             * @param {Mediator~event:COMMAND_CHAT_MESSAGES_GET} event
             * @listens Mediator~event:COMMAND_CHAT_MESSAGES_GET
             * @private
             */
            _commandGetAllMessages: function (event) {
                event.done && event.done.call(event.context, this.getAllMessages());
            },

            /**
             * Handler for application command "CollectRecentMessages"
             *
             * @param {Mediator~event:COMMAND_CHAT_MESSAGES_COLLECT_NEW} event
             * @listens Mediator~event:COMMAND_CHAT_MESSAGES_COLLECT_NEW
             * @private
             */
            _commandCollectRecentMessages: function (event) {
                event.done && event.done.call(event.context, this.collectRecentMessages());
            }
        });

    return ChatClient;
});
