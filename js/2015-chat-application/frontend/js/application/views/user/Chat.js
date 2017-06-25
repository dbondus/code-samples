define([
    'views/base/View',

    'services/applicationSettings',

    'text!./_tmpl/Chat.html'
], function(BaseView, applicationSettings, tmplData) {
    "use strict";

    /**
     * @class
     * @classdesc Chat view
     * Features:
     * 1 basic message validation
     * 2 communicates with chat client via application mediator
     */
    var Chat = BaseView.extend(
        /** @lends Chat.prototype */
        {
        /** @override */
        name: 'chatView',
        /** @override */
        template: tmplData,

        /** @override */
        className: 'ca-container-h100',

        /** @type {jQuery|string} */
        $messageText: '.e-message-text',
        /** @type {jQuery|string} */
        $messageList: '.c-messages',

        /** @override */
        events: {
            /**
             * Remove error class from text input after next keyup event
             */
            'keyup .e-message-text': function() {
                this.$messageText.hasClass('ca-message-error') && this.$messageText.removeClass('ca-message-error');
            },

            /**
             * Handler of user input
             */
            'submit .c-message': function(e) {
                e.preventDefault();

                var text = this.$messageText.val();
                text = this._sanitizeMessage(text);

                if(!this._validateMessage(text)) {
                    this.$messageText.addClass('ca-message-error');

                    return;
                }

                this.sendMessage(text);
                this.$messageText.val('');
            }
        },

        /** @type {number} */
        minCharLimit: 3,

        /**
         * @override
         * @returns {Chat}
         */
        render: function() {
            BaseView.prototype.render.call(this);

            this.$messageText = this.$(this.$messageText);
            this.$messageList = this.$(this.$messageList);

            this.showAllMessages();

            this._addEventListeners();

            return this;
        },

        /**
         * @param {string} text
         * @fires Mediator~COMMAND_CHAT_MESSAGE_SEND
         */
        sendMessage: function(text) {
            this.mediator.trigger(this.mediator.COMMAND_CHAT_MESSAGE_SEND, {
                message: text,
                user: applicationSettings.getCurrentUserName()
            });
        },

        /**
         * Executes application command and shows result
         *
         * @param {Mediator~event:EVENT_CHAT_MESSAGE_INCOMING} event
         * @listens Mediator~event:EVENT_CHAT_MESSAGE_INCOMING
         * @fires Mediator~COMMAND_CHAT_MESSAGES_COLLECT_NEW
         */
        showNewMessages: function(event) {
            this.mediator.trigger(this.mediator.COMMAND_CHAT_MESSAGES_COLLECT_NEW, {
                done: this._showMessages,
                context: this
            });
        },

        /**
         * Executes application command and shows result
         *
         * @fires Mediator~COMMAND_CHAT_MESSAGES_GET
          */
        showAllMessages: function() {
            this.mediator.trigger(this.mediator.COMMAND_CHAT_MESSAGES_GET, {
                done: this._showMessages,
                context: this
            });
        },

        /**
         * @private
         */
        _addEventListeners: function() {
            this.listenTo(this.mediator, this.mediator.EVENT_CHAT_MESSAGE_INCOMING, this.showNewMessages);
        },

        /**
         * Handles rendering of a messages pack.
         * Handles autoscrolling of the messages container
         *
         * @param {MessageData[]} messages
         * @private
         */
        _showMessages: function(messages) {
            var i = 0,
                message,
                templates = [];

            while (i < messages.length) {
                message = messages[i++];

                templates.push(
                    this.renderTemplate('message', {
                        name: message.user,
                        text: message.message,

                        //isCurrentUser: 'echoBot2000' !== message.user
                        isCurrentUser: message.user === applicationSettings.getCurrentUserName()
                    })
                );
            }

            this.$messageList.append(
                templates.join("\n")
            );

            var elem = this.$messageList.get(0);
            elem.scrollTop = elem.scrollHeight;
        },

        /**
         * Basic sanitize of the message text
         *
         * @param {string} text
         * @returns {string}
         * @private
         */
        _sanitizeMessage: function(text) {
            return text.replace(/^\s+|\s+$/gm, '');
        },

        /**
         * Basic validation of the message text
         *
         * @param {string} text
         * @returns {boolean}
         * @private
         */
        _validateMessage: function(text) {
            if(text.length < this.minCharLimit) {
                return false;
            }

            if(/<script/i.test(name)) {
                return false;
            }

            return true;
        }
    });

    return Chat;
});
