
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

    socket.on('geometry', function (data) {
        console.log("sending geometry to local user from remote helper!");
        localUserNameSpace.emit('geometry', JSON.stringify(data));
    });

    socket.on('avatar', function (data) {
        console.log("sending avatar to local user from remote helper!");
        localUserNameSpace.emit('avatar', JSON.stringify(data));
    });

    socket.on('projection', function (data) {
        console.log("sending projection to local user from remote helper!");
        localUserNameSpace.emit('projection', JSON.stringify(data));
    });
});

localUserNameSpace.on('connection', function (socket) {
    console.log('a local user connected !');

    socket.on('disconnect', function () {
        console.log('a local user disconnected');
    });

    socket.on('avatar', function (data) {
        console.log("sending avatar to remote helper from local user!");
        remoteHelperNameSpace.emit('avatar', JSON.stringify(data));
    });
    socket.on('geometry', function (data) {
        console.log("sending geometry to remote helper from local user!");
        remoteHelperNameSpace.emit('geometry', JSON.stringify(data));
    });

    socket.on('projection', function (data) {
        console.log("sending projection to remote helper from local user!");
        remoteHelperNameSpace.emit('projection', JSON.stringify(data));
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});