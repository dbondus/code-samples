define([
    'chai',
    'lib/ChatClient',
    'lib/Mediator',
    'socket.io',
    'underscore'
], function(chai, ChatClient, Mediator, io, _) {
    "use strict";

    //ToDo: move out
    var fakeSocket = {
        cb: null,
        on: function(name, cb) {
            this.cb = cb;
        },
        trigger: function(name) {
            Array.prototype.shift.apply(arguments);

            if(!this.cb) {
                throw new Error('listener is not defined');
            }

            this.cb.apply(null, arguments);
        },
        emit: function(name) {
        },
        restore: function() {
            this.cb = null;
        }
    };


    suite('ChatClient basics', function() {
        /** @type ChatClient */
        var client;
        /** @type Mediator */
        var mediator;

        setup(function() {
            mediator = new Mediator();
            client = new ChatClient(mediator, io);
        });

        teardown(function() {
            client = null;
            mediator = null;

            fakeSocket.restore();
        });

        test('shouldInitializeMessageStoragesWithEmptyArrays', function() {
            chai.assert.isArray(client.newMessages, 'newMessages should be an array');
            chai.assert.isArray(client.shownMessages, 'shownMessages should be an array');

            chai.assert.equal(client.newMessages.length, 0, 'newMessages should be empty');
            chai.assert.equal(client.shownMessages.length, 0, 'shownMessages should be empty');
        });

        test('shouldReceiveSocketInstance', function() {
            var _io = sinon.stub(io, 'connect').returns(fakeSocket);

            client.connect();

            chai.assert.isObject(client.socket, 'socket should be defined');

            _io.restore();
        });

        test('shouldListenToNewMessageEvent', function() {
            var _on = sinon.spy(fakeSocket, 'on');
            var _io = sinon.stub(io, 'connect').returns(fakeSocket);

            client.connect();

            chai.assert.isTrue(_on.calledWith('message'), 'should add "message" listener');

            _io.restore();
            _on.restore();
        });

        test('shouldListenToApplicationCommands', function() {
            var _io = sinon.stub(io, 'connect').returns(fakeSocket);
            var _on = sinon.stub(mediator, 'on');

            client.connect();

            chai.assert.isTrue(
                _on.calledWith(mediator.COMMAND_CHAT_MESSAGES_GET), 'message',
                'should listen to "get all messages" command'
            );
            chai.assert.isTrue(
                _on.calledWith(mediator.COMMAND_CHAT_MESSAGES_COLLECT_NEW),
                'should listen to "get new messages" command'
            );
            chai.assert.isTrue(
                _on.calledWith(mediator.COMMAND_CHAT_MESSAGE_SEND),
                'should listen to "send new message" command'
            );

            _io.restore();
            _on.restore();
        });

        test('shouldAddNewMessageToTheStorage', function() {
            var _io = sinon.stub(io, 'connect').returns(fakeSocket);

            var fakeMessage = {
                user: 'test',
                message: 'test1'
            };

            client.connect();

            fakeSocket.trigger('message', _.clone(fakeMessage));

            chai.assert.equal(client.newMessages.length, 1, 'newMessages should contain message');
            chai.assert.equal(client.shownMessages.length, 0, 'newMessages should be empty');
            chai.assert.equal(
                client.getNewMessagesAmount(), 1,
                'getNewMessagesAmount should return actual amount value'
            );

            chai.assert.deepEqual(client.newMessages[0], fakeMessage, 'newMessages should contain message');

            _io.restore();
        });

        test('shouldSendNotificationToApplication', function() {
            var _io = sinon.stub(io, 'connect').returns(fakeSocket);
            var _on = sinon.stub(mediator, 'trigger');

            client.connect();

            fakeSocket.trigger('message', {
                user: 'test',
                message: 'test1'
            });

            chai.assert.isTrue(_on.calledWith(mediator.EVENT_CHAT_MESSAGE_INCOMING), 'notification should be send');
            chai.assert.isTrue(
                _on.calledWithExactly(mediator.EVENT_CHAT_MESSAGE_INCOMING, { amount: 1}),
                'notification should be send with actual amount value'
            );

            _io.restore();
            _on.restore();
        });

        test('shouldRespondToSendNewMessageCommandAndSendItTheServer', function() {
            var _io = sinon.stub(io, 'connect').returns(fakeSocket);
            var _emit = sinon.stub(fakeSocket, 'emit');

            client.connect();

            mediator.trigger(mediator.COMMAND_CHAT_MESSAGE_SEND, {
                user: 'test',
                message: 'test1'
            });

            chai.assert.isTrue(_emit.calledWith('message'), 'message event should be send via socket.io');
            chai.assert.isTrue(
                _emit.calledWithExactly('message', { message: 'test1', user: "test" }),
                'message event should be send with actual message data'
            );

            _io.restore();
            _emit.restore();
        });

        test('shouldSendMessageToTheServer', function() {
            var _io = sinon.stub(io, 'connect').returns(fakeSocket);
            var _emit = sinon.stub(fakeSocket, 'emit');

            client.connect();

            client.sendMessage({
                user: 'user1',
                message: 'text1'
            });

            chai.assert.isTrue(_emit.calledWith('message'), 'message event should be send via socket.io');
            chai.assert.isTrue(
                _emit.calledWithExactly('message', { message: 'text1', user: "user1" }),
                'message event should be send with actual message data'
            );

            _io.restore();
            _emit.restore();
        });

        test('shouldReturnAllAvailableMessagesAndEmptyNewMessagesStorage', function() {
            client.shownMessages = [
                {user: 'test', message: 'test1'},
                {user: 'test', message: 'test2'}
            ];
            client.newMessages = [
                {user: 'test', message: 'test5'},
                {user: 'test', message: 'test7'}
            ];

            var allMessages = client.shownMessages.concat(client.newMessages);

            var result = client.getAllMessages();

            chai.assert.isArray(result, 'getAllMessages should return an array');
            chai.assert.isArray(client.shownMessages, 'shownMessages should remain as an array');
            chai.assert.isArray(client.newMessages, 'newMessages should remain as an array');

            chai.assert.equal(client.newMessages.length, 0, 'newMessages should be empty');
            chai.assert.equal(client.shownMessages.length, 4, 'shownMessages should contain all available messages');
            chai.assert.deepEqual(
                client.shownMessages, allMessages,
                'shownMessages should contain all available messages without format changes'
            );

            result.push({user: 'test', message: 'test3'});

            chai.assert.equal(client.shownMessages.length, 4, 'getAllMessages should return copy of all available messages');
        });

        test('shouldReturnCopyOfRecentMessagesAndEmptyNewMessagesStorageAndMoveOriginalsToShownMessagesStorage', function() {
            client.shownMessages = [
                {user: 'test', message: 'test1'},
                {user: 'test', message: 'test2'}
            ];
            client.newMessages = [
                {user: 'test', message: 'test5'},
                {user: 'test', message: 'test7'}
            ];

            var allMessages = client.shownMessages.concat(client.newMessages);

            var result = client.collectRecentMessages();

            chai.assert.isArray(result, 'collectRecentMessages should return an array');
            chai.assert.isArray(client.shownMessages, 'shownMessages should remain as an array');
            chai.assert.isArray(client.newMessages, 'newMessages should remain as an array');

            chai.assert.equal(client.newMessages.length, 0, 'newMessages should be empty');
            chai.assert.equal(client.shownMessages.length, 4, 'shownMessages should contain all available messages');
            chai.assert.deepEqual(
                client.shownMessages, allMessages,
                'shownMessages should contain all available messages without format changes'
            );

            result.push({user: 'test', message: 'test3'});

            chai.assert.equal(client.newMessages.length, 0, 'collectRecentMessages should return copy of recent messages');
        });

        test('shouldRespondToGetAllMessagesCommandAndSendMessagesBack', function() {
            var _io = sinon.stub(io, 'connect').returns(fakeSocket);

            client.connect();

            client.shownMessages = [
                {user: 'test', message: 'test1'},
                {user: 'test', message: 'test2'}
            ];
            client.newMessages = [
                {user: 'test', message: 'test7'}
            ];

            var fakeCaller = {
                messages: null,
                processMessages: function(messages) {
                    this.messages = messages;
                }
            };

            mediator.trigger(mediator.COMMAND_CHAT_MESSAGES_GET, {
                done: fakeCaller.processMessages,
                context: fakeCaller
            });

            chai.assert.isArray(fakeCaller.messages, 'messages should be returned as as an array');
            chai.assert.equal(fakeCaller.messages.length, 3, 'all available messages should be returned');

            _io.restore();
        });

        test('shouldRespondToGetNewMessagesCommandAndSendMessagesBack', function() {
            var _io = sinon.stub(io, 'connect').returns(fakeSocket);

            client.connect();

            client.shownMessages = [
                {user: 'test', message: 'test1'},
            ];
            client.newMessages = [
                {user: 'test', message: 'test5'},
                {user: 'test', message: 'test7'}
            ];

            var fakeCaller = {
                messages: null,
                processMessages: function(messages) {
                    this.messages = messages;
                }
            };

            mediator.trigger(mediator.COMMAND_CHAT_MESSAGES_COLLECT_NEW, {
                done: fakeCaller.processMessages,
                context: fakeCaller
            });

            chai.assert.isArray(fakeCaller.messages, 'messages should be returned as as an array');
            chai.assert.equal(fakeCaller.messages.length, 2, 'all available messages should be returned');

            mediator.trigger(mediator.COMMAND_CHAT_MESSAGES_COLLECT_NEW, {
                done: fakeCaller.processMessages,
                context: fakeCaller
            });

            chai.assert.equal(fakeCaller.messages.length, 0, 'second call should return an empty array');

            _io.restore();
        });
    });
});


