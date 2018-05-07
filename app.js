
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// namespace for the vr remote helper to connect to
const remoteHelperNameSpace = io.of('/remote-helper');

// namespace for the ar local user to connect to
const localUserNameSpace = io.of('/local-user');

remoteHelperNameSpace.on('connection', function (socket) {
    console.log('a remote helper connected !');

    socket.on('disconnect', function () {
        console.log('a remote helper disconnected');
    });

    socket.on('data', function (data) {
        console.log("sending date to local user from remote helper!");
        localUserNameSpace.emit('data', JSON.stringify(data));
    });
});

localUserNameSpace.on('connection', function (socket) {
    console.log('a local user connected !');

    socket.on('disconnect', function () {
        console.log('a local user disconnected');
    });

    socket.on('data', function (data) {
        console.log("sending date to remote helper from local user!");
        remoteHelperNameSpace.emit('data', JSON.stringify(data));
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});