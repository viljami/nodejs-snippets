/*
    Code based on:
    1. http://www.emanueleferonato.com/2008/07/17/create-a-flash-game-like-totem-destroyer/

    Viljami Peltola, 2013
*/

var Box2d = require('box2dweb');
var helpers = require('./lib/helpers');
var Box2dKickstart = require('./lib/box2d-kickstart');

var b2Body = Box2d.Dynamics.b2Body;
var b2Vec2 = Box2d.Common.Math.b2Vec2;

var canvasPosition;
var b2kickstart;

var groundb2Body;

var initialize = function(){
    b2kickstart = new Box2dKickstart({
        initDebugDraw: true
    });

    var canvas = b2kickstart.canvas;
    canvasPosition = helpers.getElementPosition(canvas);

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);

    constructLevel();
};

var constructLevel = function(){
    var width = document.body.offsetWidth;
    var height = document.body.offsetHeight;
    var halfW = width / 2;

    groundb2Body = b2kickstart.createBox(halfW, height, width, 20, b2Body.b2_staticBody);

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


var b2mouseJoint;
var mousePos = {};

var onMouseDown = function(event) {
    b2kickstart.getb2FixtureAt(event.clientX, event.clientY)
    .then(function(b2fixture){
        if (b2mouseJoint) b2kickstart.destroyJoint(b2mouseJoint);

        var b2body = b2fixture.GetBody();
        b2mouseJoint = b2kickstart.createb2MouseJoint(mousePos.x - 10, mousePos.y - 10, b2body, groundb2Body);
    })
    .fail(function(obj){
        console.log('failed to get fixture, got: ', obj);
    });
};

var onMouseMove = function(event){
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;

    if (b2mouseJoint) {
        var b2vec2 = new b2Vec2(
            mousePos.x / b2kickstart.worldScale,
            mousePos.y / b2kickstart.worldScale
        );
        b2mouseJoint.SetTarget(b2vec2);
    }
};

var onMouseUp = function() {
    if (b2mouseJoint) {
        b2kickstart.destroyJoint(b2mouseJoint);
        b2mouseJoint = null;
    }
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
