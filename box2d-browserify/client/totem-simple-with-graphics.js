/*
    Code based on:
    1. http://www.emanueleferonato.com/2008/07/17/create-a-flash-game-like-totem-destroyer/

    Viljami Peltola, 2013
*/

var Box2d = require('box2dweb');
var helpers = require('./lib/helpers');
var Box2dKickstart = require('./lib/box2d-kickstart');
var Box2dDraw = require('./lib/box2d-draw');
var b2Body = Box2d.Dynamics.b2Body;

var canvasPosition;
var b2kickstart;
var box2dDraw;

var initialize = function(){
    b2kickstart = new Box2dKickstart();
    box2dDraw = new Box2dDraw(b2kickstart.canvasContext, b2kickstart.worldScale);

    var canvas = b2kickstart.canvas;
    canvasPosition = helpers.getElementPosition(canvas);
    canvas.addEventListener('click', mouseHandler);

    constructLevel();
};

var constructLevel = function(){
    var width = document.body.offsetWidth;
    var height = document.body.offsetHeight;
    var halfW = width / 2;

    // ground
    b2kickstart.createBox(halfW, height, width, 20, b2Body.b2_staticBody);

    // pillars
    var pos = {x: halfW, y: height};
    for (var i = 0; i < 6; ++i){
        pos.y = pos.y - 32;
        b2kickstart.createBox(pos.x - 100, pos.y, 30, 30, b2Body.b2_dynamicBody);
        b2kickstart.createBox(pos.x + 100, pos.y, 30, 30, b2Body.b2_dynamicBody);
    }

    // bar
    b2kickstart.createBox(pos.x, pos.y - 32, 400, 30, b2Body.b2_dynamicBody);

    // ball
    b2kickstart.createBall(pos.x, pos.y - 62, 25, b2Body.b2_dynamicBody);

};

var mouseHandler = function (event) {
    b2kickstart.getb2FixtureAt(event.clientX, event.clientY)
    .then(function(obj){
        b2kickstart.destroyb2Body(obj.GetBody());
    })
    .fail(function(obj){
        console.log('failed to get fixture, got: ', obj);
    });
};

var start = function(){
    setInterval(gameloop, 1000/60);
};

var gameloop = function(){
    b2kickstart.update();

    box2dDraw.drawb2World(b2kickstart.world);
};

window.onload = function(){
    initialize();
    start();
};
