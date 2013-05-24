var express = require('express'),
	app = express(),
	server = require('http').createServer(app);

// Settings
app.use(express.static(__dirname + '/public'));

// Server Start
var port = 4100;
server.listen( port );
console.log( 'Server started at http://localhost:' + port );
