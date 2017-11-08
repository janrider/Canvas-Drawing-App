var canvas = document.querySelector("#canvas");
var nav = document.querySelector("nav");

var wW = window.innerWidth;
var wH = window.innerHeight;

const SPEED = 1;

canvas.width = wW;
canvas.height = wH;
canvas.opacity = 0.65;
canvas.length = 200;
canvas.isDraw = false;
canvas.source = '1';
canvas.mousePress = false;

if (canvas.getContext) {
  var ctx = canvas.getContext("2d");

  var koof = function() {
    return Math.round(Math.random() * 1000) / 1000;
  }
  var C = function(opacity) {
    return opacity + Math.round(Math.random()) * 0.4;
  };
  var color = function() {
    return Math.round(Math.random() * (120 - 10) + 10);
  };

  canvas.drawLine = function(mX, mY) {
    ctx.beginPath();

    var float = function () {
      return Math.floor((Math.random() * (15) + 5) * (Math.random() < 0.5 ? -1 : 1));
    };

    const point = {
      x: (mX && mY) ? mX + float() : Math.floor(Math.random() * (wW) * 100) / 100,
      y: (mX && mY) ? mY + float() : Math.floor(Math.random() * (wH) * 100) / 100,
    };

    const sign = function() {
      return (Math.random() < 0.5 ? -1 : 1);
    }

    const signX = sign();
    const signY = sign();

    const lineSize = function() {
      return Math.floor((Math.random() * canvas.length));
    };

    const line = {
      sX: point.x + lineSize() * signX,
      sY: point.y + lineSize() * signY,
      eX: point.x + lineSize() * -signX,
      eY: point.y + lineSize() * -signY,
    };

    ctx.moveTo(line.sX, line.sY);
    ctx.lineTo(line.eX, line.eY);

    ctx.strokeStyle = 'rgba(' + color() + ', ' + color() + ', ' + color() + ', ' + (C(canvas.opacity)) + ')';
    ctx.stroke();
  };

  canvas.setOpacity = function (slider) {
    canvas.opacity = slider.value;
  };

  canvas.setLength = function (slider) {
    canvas.length = slider.value;
  };

  canvas.moveOnCanvas = function(e) {
    if (
      canvas.isDraw &&
      (canvas.source === '2' || (canvas.source === '1' && canvas.mousePress))
    ) {
      canvas.drawLine(e.pageX, e.pageY)
    }
  };

  canvas.setSource = function(selectObject) {
    clearInterval(canvas.interval);

    canvas.source = selectObject.value;

    canvas.setDraw(true);
  };

  canvas.setDraw = function(val) {
    canvas.isDraw = val;
    if (val) {
      nav.classList.add('active')

      if (canvas.source === '0') {
        canvas.interval = setInterval(function() {
          canvas.drawLine()
        }, Math.floor(Math.random() * (SPEED - (SPEED / 2) + (SPEED / 2)) * 100) / 100)
      }
    } else {
      nav.classList.remove('active')
      if (canvas.interval) {
        clearInterval(canvas.interval);
      }
    }
  }

  canvas.clearAll = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  canvas.mouseDown = function() {
    canvas.mousePress = true;
  };
  canvas.mouseUp = function() {
    canvas.mousePress = false;
  };

  canvas.addEventListener('mousedown', canvas.mouseDown);
  canvas.addEventListener('mousemove', canvas.moveOnCanvas);
  canvas.addEventListener('touchstart', canvas.mouseDown);
  canvas.addEventListener('touchmove', canvas.moveOnCanvas);

  window.addEventListener('mouseup', canvas.mouseUp);
  window.addEventListener('touchend', canvas.mouseUp);
}
