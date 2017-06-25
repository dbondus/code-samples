var express = require('express'),
    sio = require('socket.io');

var app = express.createServer();
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT || 5000, function () {
    var addr = app.address();

    console.log('app listening on http://' + addr.address + ':' + addr.port);
});

var io = sio.listen(app);
io.sockets.on('connection', function (socket) {
    socket.on('message', function (msgData) {
        console.log('msg', msgData);

        io.sockets.emit('message', msgData);
    });

    sendMessage(socket);
});

var sendMessage = function(socket) {
    socket.emit('message', {
        message : 'Hello!',
        user : 'echoBot2000'
    });

    setTimeout(sendMessage.bind(null, socket), Math.ceil(Math.random()*5000));
};
