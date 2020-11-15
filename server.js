var express = require('express');          // Require express.
var app     = express();                   // Create express object.
var server  = require('http').Server(app); // Require http server.
var port    = process.env.PORT || 3000;    // Use environment port, otherwise use port 3000.
var io      = require('socket.io')(server);  // Socket.io

class PlayerAccount {
    constructor() {

    }
}

class GameInfo {
    constructor() {

    }
}

app.use(express.static(__dirname + '/public')); // Declare directory with static files.

//Attempt to login.
app.get('/login', (req, res) => {
    let uname = req.query.uname;
    let upass = req.query.upass;

    res.send(/*Will send if account exists or not*/);
});

//Attempt to create an account.
app.post('/createaccount', (req, res) => {
    res.send(/*Will send if account was created.*/)
});

//For grabbing the game.html for testing.
app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/public/game.html');
});

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