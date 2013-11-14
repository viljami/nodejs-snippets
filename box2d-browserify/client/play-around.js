/*
    Code based on:
    1. http://www.emanueleferonato.com/2008/03/21/playing-with-box2dflashas3/
    2. http://www.emanueleferonato.com/2012/12/03/introducing-box2dweb-create-box2d-projects-in-html5/

    Viljami Peltola, 2013
*/

var Box2d = require('box2dweb');
var helpers = require('./lib/helpers');
var Box2dKickstart = require('./lib/box2d-kickstart');

var b2Body = Box2d.Dynamics.b2Body;

var canvasPosition;
var b2kickstart;

var initialize = function(){
    b2kickstart = new Box2dKickstart({
        initDebugDraw: true
    });

    var canvas = b2kickstart.canvas;
    canvasPosition = helpers.getElementPosition(canvas);
    canvas.addEventListener('click', mouseHandler);

    var width = document.body.offsetWidth;
    var height = document.body.offsetHeight;

    b2kickstart.createBox(width / 2, height, width, 20, b2Body.b2_staticBody); // ground
    b2kickstart.createBox(width / 2, 60, 30, 30, b2Body.b2_dynamicBody);
    b2kickstart.createBox((width / 2) + 25, 0, 30, 30, b2Body.b2_dynamicBody);
};


var mouseHandler = function (event) {
    b2kickstart.createBox(
        event.clientX - canvasPosition.x,
        0,
        Math.random() * 40 + 40,
        Math.random() * 40 + 40,
        b2Body.b2_dynamicBody
    );
};


var start = function(){
    setInterval(gameloop, 1000/60);
};

var gameloop = function(){
    b2kickstart.update();
};

window.onload = function(){
    initialize();
    start();
};
