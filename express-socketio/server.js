var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

// Public files
app.use(express.static(__dirname + '/public'));

// Start the server
var port = 4100;
server.listen( port );
console.log( 'Server started at http://localhost:' + port );

// When a socket connects
io.sockets.on('connection', function (socket) {

	// Keep sending messages to this socket.
	setInterval(function () {
		socket.emit('hello', { hello: 'world' });
	}, 1000 );

	// Recieve messages from socket
	socket.on('more', function (data) {
		console.log( 'Recieved: ', data);
	});

});
