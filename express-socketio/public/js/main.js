var moreWhat = [ 'bass', 'cat pics', 'sun', 'chill', 'climbing', 'nodejs', 'socket', 'cartoons', 'water on the stones (sauna)', 'this'];

var socket = io.connect('http://localhost');

socket.on('hello', function (data) {
	console.log(data);
	document.body.innerHTML += '<p>';
	for( var i in data ) {
		document.body.innerHTML += i + ': ' + data[ i ];
	}
	document.body.innerHTML += '</p>';
	socket.emit('more', { more: moreWhat[ Math.floor( Math.random() * 10 )] });
});

