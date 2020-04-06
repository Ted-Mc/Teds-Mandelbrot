/*global document*/
/*eslint no-unused-vars:"off"*/
/*eslint no-undef:"off"*/

var xMin = -2;
var xMax = 2;
var yMin = -2;
var yMax = 2;
var pixelSize = 0;
var myCanvas;
var ctx;
var values = [];
var maxIter = 100;
var newBox = [];
var isBusy = false;

function setUp() {
    myCanvas = document.getElementById("myCanvas");
    myCanvas.addEventListener("mousedown", clickDown);
    myCanvas.addEventListener("mouseup", clickUp);
    
    ctx = myCanvas.getContext("2d");
    values = new Array(myCanvas.width).fill(new Array(myCanvas.length));
}

function reset(){
    xMin = -2;
    xMax = 2;
    yMin = -2;
    yMax = 2;
    
    compute();
}

function compute() {
    isBusy = true;
    pixelSize = (xMax - xMin) / myCanvas.width;
    console.log(pixelSize);
    var x = xMin;
    var y = yMax;
    for (var i = 0; i < myCanvas.width; i++) {
        x = xMin + (pixelSize * i);
        for (var j = 0; j < myCanvas.height; j++) {
            y = yMax - (pixelSize * j);
            var value = computePoint(x, y);
            ctx.fillStyle = "rgb(" + value / maxIter * 255 + ", 0, 0)";
            ctx.fillRect(i, j, 1, 1);
        }
    }
    isBusy = false;
}

function computePoint(cReal, cImag) {
    var zReal = 0;
    var zImag = 0;
    var realTemp = 0;
    var imagTemp = 0;
    for (var n = 0; n < maxIter; n++) {
        realTemp = (zReal * zReal) - (zImag * zImag) + cReal;
        imagTemp = (2.0 * zReal * zImag) + cImag;
        zReal = realTemp;
        zImag = imagTemp;
        if (Math.abs(zReal) > 1000000) {
            return n;
        }
    }
    return n;
}

function clickDown(event){
    if (isBusy){
        return;
    }
    
    var x = event.clientX - myCanvas.getBoundingClientRect().left;
    var y = event.clientY - myCanvas.getBoundingClientRect().top;
    
    newBox[0] = xMin + (x / myCanvas.width) * (xMax - xMin);
    newBox[1] = yMax - (y / myCanvas.height) * (yMax - yMin);

}

function clickUp(event){
    if (isBusy){
        return;
    }
    
    var x = event.clientX - myCanvas.getBoundingClientRect().left;
    var y = event.clientY - myCanvas.getBoundingClientRect().top;
    
    newBox[2] = xMin + (x / myCanvas.width) * (xMax - xMin);
    newBox[3] = yMax - (y / myCanvas.height) * (yMax - yMin);
    
    recalcRect();
}

function recalcRect(){
    var deltaX = Math.abs(newBox[2] - newBox[0]);
    var deltaY = Math.abs(newBox[3] - newBox[1]);
    
    if (deltaX > deltaY){
        //  Its a fat rectangle
        xMin = Math.min(newBox[0], newBox[2]);
        xMax = Math.max(newBox[0], newBox[2]);
        var yAverage = (newBox[3] + newBox[1]) / 2;
        yMin = yAverage - (deltaX / 2);
        yMax = yAverage + (deltaX / 2);
  
    } else {
        //  Its a tall rectangle
        yMin = Math.min(newBox[1], newBox[3]);
        yMax = Math.max(newBox[1], newBox[3]);
        var xAverage = (newBox[2] + newBox[0]) / 2;
        xMin = xAverage - (deltaY / 2);
        xMax = xAverage + (deltaY / 2);
    }
    
    compute();
}