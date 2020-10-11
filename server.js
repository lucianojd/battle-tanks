var express = require('express');          // Require express.
var app     = express();                   // Create express object.
var server  = require('http').Server(app); // Require http server.
var port    = process.env.PORT || 3000;    // Use environment port, otherwise use port 3000.

app.use(express.static(__dirname + '/public')); // Declare directory with static files.

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Return index.html in the public folder.
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})