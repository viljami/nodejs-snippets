/* globals document, window, console */
var $ = require('jquery-browserify');

var getCanvas = function(){
    var canvases = document.getElementsByTagName('canvas');
    if (canvases.length) return canvases[0];

    var canvas = document.createElement('canvas');
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
    document.body.appendChild(canvas);

    $(window).resize(function(){
        canvas.width = document.body.offsetWidth;
        canvas.height = document.body.offsetHeight;
    });

    if(! canvas.getContext) console.log('Canvas not supported!');

    return canvas;
};

//http://js-tut.aardon.de/js-tut/tutorial/position.html
var getElementPosition = function(element) {
    var elem = element,
        tagname = "",
        x = 0,
        y = 0;

    while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
        y += elem.offsetTop;
        x += elem.offsetLeft;
        tagname = elem.tagName.toUpperCase();
        if (tagname == "BODY"){
            elem=0;
        }
        if (typeof(elem) == "object"){
            if (typeof(elem.offsetParent) == "object"){
                elem = elem.offsetParent;
            }
        }
    }
    return {x: x, y: y};
};

module.exports = {
    getCanvas: getCanvas,
    getElementPosition: getElementPosition
};