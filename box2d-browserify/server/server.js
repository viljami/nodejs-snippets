/* globals __dirname, console */

/*
 * For these reasons a server:
 * 1. Short url.
 * 2. To provide assets.
 */

var express = require('express');
var app = express();

console.log(__dirname);

app.configure('development', function(){
    app.set('dbURL', '');
    app.use(express.static(__dirname + '/../public'));
    app.use(express.cookieParser());
    app.use(express.session({secret: 'Dont worry, be happy.'}));
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: '/../public/uploads' }));
    app.use(express.bodyParser());
});

console.log('App url: http://localhost:3000');
app.listen(3000);