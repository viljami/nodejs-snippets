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
	updateInterval: 250
};

var me = null,
	all = [],
	position = {};

window.onload = function () {
	document.body.onmousemove = function ( e ) {
		position.x = e.x;
		position.y = e.y;
	};

	var socket = io.connect('http://localhost');

	socket.on('me', function ( data ) {
		if( me === null ) {
			me = data;
		}
	});

	socket.on('all-visitors', function ( data ) {
		all = data;
		for( var i  = 0; i < all.length; i++ ) {
			var element = document.getElementById( all[i]._id );
			if( !element ) {
				element = document.createElement('div');
				document.body.appendChild( element );
				element.id = all[i]._id;
				if( all[i]._id != me._id ) {
					element.className = 'visitor';
				} else {
					element.className = 'me';
				}
			}
			element.style.left = (all[i].position.x - 25) + 'px';
			element.style.top = (all[i].position.y - 25) + 'px';
		}
	});

	setInterval( function() {
		socket.emit('position', position );
	}, options.updateInterval );
};
