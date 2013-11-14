var _ = require('lodash');

var _eachb2List = function(b2listItem, fn, context){
    fn = _.bind(fn, context || window);

    while(b2listItem){
        fn(b2listItem);
        b2listItem = b2listItem.GetNext();
    }
};

var b2CanvasDraw = function(canvasContext, scale){
    this.canvasContext = canvasContext;
    this.scale = scale;

    this._scaleUp = function(number){
        return number * this.scale;
    };

    this._moveToVerticesEnd = function(b2vertices){
        var lastb2vertice = _.last(b2vertices);
        this.canvasContext.moveTo(
            this._scaleUp(lastb2vertice.x),
            this._scaleUp(lastb2vertice.y)
        );
    };

    this._draw2VerticeLine = function(vertice){
        this.canvasContext.lineTo(
            this._scaleUp(vertice.x),
            this._scaleUp(vertice.y)
        );
    };

    this._drawb2Fixture = function(b2fixture){
        if (! b2fixture) return;

        var b2shape = b2fixture.GetShape();
        if (b2shape.GetRadius) {
            this.canvasContext.beginPath();
            this.canvasContext.fillStyle = 'red';
            this.canvasContext.arc(
                0,
                0,
                this._scaleUp(b2shape.GetRadius()),
                0,
                2 * Math.PI,
                true
            );
            this.canvasContext.fill();
        } else {
            this.canvasContext.beginPath();
            this.canvasContext.fillStyle = 'green';

            var b2vertices = b2shape.GetVertices();
            this._moveToVerticesEnd(b2vertices);
            _.each(b2vertices, this._draw2VerticeLine, this);

            this.canvasContext.fill();
        }
    };

    this.drawb2Body = function(b2body){
        if (! b2body) return;

        this.canvasContext.save();

        var position = b2body.GetPosition();
        this.canvasContext.translate(
            this._scaleUp(position.x),
            this._scaleUp(position.y)
        );
        this.canvasContext.rotate(b2body.GetAngle()); // both are radians

        var b2fixtures = b2body.GetFixtureList();
        _eachb2List(b2fixtures, this._drawb2Fixture, this);

        this.canvasContext.restore();
    };

    this.clearCanvas = function(){
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = 'black';
        this.canvasContext.fillRect(
            0,
            0,
            this.canvasContext.canvas.offsetWidth,
            this.canvasContext.canvas.offsetHeight
        );
    };

    this.drawb2World = function(b2world){
        this.clearCanvas();

        var b2bodies = b2world.GetBodyList();
        _eachb2List(b2bodies, this.drawb2Body, this);
    };
};

module.exports = b2CanvasDraw;