/* globals console */

var Box2d = require('box2dweb');
var _ = require('lodash');
var Q = require('q');
var helpers = require('./lib/helpers');

console.log('Box2d', Box2d);

var b2DebugDraw = Box2d.Dynamics.b2DebugDraw;
var b2Vec2 = Box2d.Common.Math.b2Vec2;
// var b2AABB = Box2d.Collision.b2AABB;
var b2PolygonShape = Box2d.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2d.Collision.Shapes.b2CircleShape;

var b2World = Box2d.Dynamics.b2World;
// var b2Body = Box2d.Dynamics.b2Body;
var b2BodyDef = Box2d.Dynamics.b2BodyDef;
var b2Fixture = Box2d.Dynamics.b2Fixture;
var b2FixtureDef = Box2d.Dynamics.b2FixtureDef;
var b2MouseJointDef = Box2d.Dynamics.Joints.b2MouseJointDef;

var Box2dKickstart = function(options){

    this.initialize = function(options){
        if (! options) options = {};

        this.canvas = options.canvas || helpers.getCanvas();
        this.canvasContext = this.canvas.getContext("2d");
        this.worldScale = options.worldScale || 30;
        this.world = options.world || new b2World(new b2Vec2(0, 10), true);
        this.timeStep = 1/60 || options.timeStep;

        if (options.initDebugDraw) this.initDebugDraw(this.canvas);
    };

    this.createBody = function(x, y, b2type, b2shape, userData){
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2type;
        bodyDef.position.Set(
            x / this.worldScale,
            y / this.worldScale
        );
        bodyDef.userData = userData;

        var fixtureDef = new b2FixtureDef();
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.5;
        fixtureDef.restitution = 0.3;
        fixtureDef.shape = b2shape;

        var body = this.world.CreateBody(bodyDef);
        body.CreateFixture(fixtureDef);
        return body;
    };

    this.createBox = function(x, y, width, height, b2type, userData){
        var b2polygonShape = new b2PolygonShape();
        b2polygonShape.SetAsBox(
            width / 2 / this.worldScale,
            height / 2 / this.worldScale
        );

        var body = this.createBody(x, y, b2type, b2polygonShape, userData);
        return body;
    };

    this.createBall = function(x, y, radius, b2type){
        var b2circleShape = new b2CircleShape();
        b2circleShape.m_radius = radius / this.worldScale;

        var body = this.createBody(x, y, b2type, b2circleShape);
        return body;
    };

    this.destroyb2Body = function(b2body){
        this.world.DestroyBody(b2body); // destroys all its b2fixtures too
    };

    this.createb2MouseJoint = function(mouseX, mouseY, b2body, groundb2Body){
        var b2mouseJointDef = new b2MouseJointDef();
        b2mouseJointDef.bodyA = groundb2Body;
        b2mouseJointDef.bodyB = b2body;
        b2mouseJointDef.target = new b2Vec2(
            mouseX / this.worldScale,
            mouseY / this.worldScale
        );
        b2mouseJointDef.maxForce = 100 * b2body.GetMass();
        b2mouseJointDef.collideConnected = true;
        b2mouseJointDef.dampingRatio = 1.5;
        var mouseJoint = this.world.CreateJoint(b2mouseJointDef);

        b2body.SetAwake(true);
        return mouseJoint;
    };

    this.destroyJoint = function(b2joint){
        this.world.DestroyJoint(b2joint);
    };

    this.getb2FixtureAt = function(x, y){
        var deferred = Q.defer();

        this.world.QueryPoint(
            _.bind(function(obj){
                if(obj instanceof b2Fixture) deferred.resolve(obj);
                else deferred.reject(obj);
            }, this),
            new b2Vec2(x / this.worldScale, y / this.worldScale)
        );

        return deferred.promise;
    };

    this.initDebugDraw = function(canvas){
        if (! canvas) canvas = this.canvas;

        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(this.canvasContext);
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);
    };

    this.update = function() {
        this.world.Step(this.timeStep, 10, 10);
        this.world.DrawDebugData();
        this.world.ClearForces();
    };

    this.eachb2List = function(b2listItem, fn){
        while(b2listItem){
            fn(b2listItem);
            b2listItem = b2listItem.GetNext();
        }
    };

    this.scaleUp = function(number){
        return number * this.worldScale;
    };

    this.scaleDown = function(number){
        return number / this.worldScale;
    };

    this.initialize(options);
};

module.exports = Box2dKickstart;