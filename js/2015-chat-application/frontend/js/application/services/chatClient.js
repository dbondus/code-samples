define([
    'lib/ChatClient',

    'services/mediator',
    'socket.io'
], function(ChatClient, mediator, io) {
    "use strict";

    return new ChatClient(mediator, io);
});
