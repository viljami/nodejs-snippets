/*
   Copyright 2013  Viljami Peltola

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var options = {
	transmitInterval: 500
};

(function () {
	"use strict";
	var express = require('express'),
		app = express(),
		server = require('http').createServer(app),
		mongoose = require('mongoose');

	// Database
	mongoose.connect('mongodb://localhost/visitor');

	var Schema = mongoose.Schema,
		ObjectId = Schema.Types.ObjectId;

	var PositionSchema = new Schema({
		x: { type: Number, 'default': 100 },
		y: { type: Number, 'default': 100 }
	});
	var Position = mongoose.model( 'Position', PositionSchema );

	var Visitor = mongoose.model( 'Visitor', new Schema({
		name: String,
		position: { type: ObjectId, ref: 'Position' }
	}));

	// Clear database
	Position.remove({}, function(err) {});
	Visitor.remove({}, function(err) {});

	// Server
	app.use(express.static(__dirname + '/public'));

	// Start the server
	var port = 4100;
	server.listen( port );
	console.log( 'Server started at http://localhost:' + port );

	// Sockets
	var io = require('socket.io').listen(server);

	setInterval(function () {
		Visitor.find({}).populate('position').exec( function (err, allVisitors) {
			io.sockets.emit('all-visitors', allVisitors );
		});
	}, options.transmitInterval );

	io.sockets.on('connection', function (socket) {
		var visitor = null;
		var position = new Position();
		position.save(function (err) {
			if(err) return console.log(err);
			visitor = new Visitor({ position: position._id });
			visitor.save(function(err) {
				if(err) return console.log(err);
				// A new visitor has been created and shared
				socket.emit( 'me', visitor );
			});
		});

		// Recieve messages from socket
		socket.on('position', function (data) {
			if( !visitor ) return;
			if( data.x && data.y ) {
				var pos = { x: data.x, y: data.y };
				Position.findByIdAndUpdate( visitor.position, pos, function ( err, doc ) {
					if( err ) return console.log( err );
				});
			}
		});
	});
})();