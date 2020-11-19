var express = require('express');            //Require express.
var app     = express();                     //Create express object.
var server  = require('http').Server(app);   //Require http server.
var port    = process.env.PORT || 3000;      //Use environment port, otherwise use port 3000.
var io      = require('socket.io')(server);  // Socket.io

//Declare directory with static files.
app.use(express.static(__dirname + '/public'));

//Socket.io for game.
io.on('connection', (socket) => {
    socket.on('sendTankMove', (move) => {

    });
    socket.on('fireTankShell', (move) => {

    });
    socket.on('sendTimeUpdate', (move) => {

    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})