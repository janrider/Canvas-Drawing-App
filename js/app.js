var canvas = document.querySelector("#canvas");
var nav = document.querySelector("nav");

var wW = window.innerWidth;
var wH = window.innerHeight;

const SPEED = 1;

canvas.width = wW;
canvas.height = wH;
canvas.opacity = 0.65;
canvas.length = 200;
canvas.isDraw = true;
canvas.source = '1';
canvas.type = '3';
canvas.mousePress = false;
canvas.sizeKoof = canvas.type === '3' ? 5 : 2;

if (canvas.getContext) {
  var ctx = canvas.getContext("2d");

  ctx.lineWidth = 1;
  ctx.lineJoin = ctx.lineCap = 'round';

  var opacity = function(opacity) {
    return opacity + Math.round(Math.random()) * 0.4;
  };

  var color = function() {
    return Math.round(Math.random() * (120 - 10) + 10);
  };

  var endLine = null;

  canvas.setOpacity = function (slider) {
    canvas.opacity = slider.value;
  };

  canvas.setLength = function (slider) {
    canvas.length = slider.value;
  };

  canvas.setSource = function(selectObject) {
    clearInterval(canvas.interval);

    canvas.source = selectObject.value;
    endLine = null;

    if (canvas.source == '0') {
      nav.classList.remove('mouse');
      canvas.setDraw(false);
    } else {
      nav.classList.add('mouse');
      canvas.setDraw(true);
    }
  };

  canvas.setDraw = function(val) {
    canvas.isDraw = val;
    if (val) {
      nav.classList.add('active')

      if (canvas.source === '0') {
        canvas.interval = setInterval(function() {
          drawCanvas()
        }, Math.floor(Math.random() * (SPEED - (SPEED / 2) + (SPEED / 2)) * 100) / 100)
      }
    } else {
      nav.classList.remove('active')
      if (canvas.interval) {
        clearInterval(canvas.interval);
      }
    }
  }

  canvas.setType = function(lineType) {
    canvas.type = lineType.value
    endLine = null;
    canvas.sizeKoof = (lineType.value === '3') ? 5 : 2;
  }

  canvas.clearAll = function() {
    endLine = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  canvas.moveOnCanvas = function(e) {
    if (canvas.isDraw && (canvas.source === '2' || (canvas.source === '1' && canvas.mousePress))) {
      clearInterval(canvas.interval);
      drawCanvas(e.pageX, e.pageY)
    }
  };

  canvas.mouseDown = function(e) {
    canvas.mousePress = true;
    if (canvas.isDraw && canvas.source === '1') {
      canvas.interval = setInterval(function() {
        drawCanvas(e.pageX, e.pageY)
      }, Math.floor(Math.random() * (SPEED - (SPEED / 2) + (SPEED / 2)) * 100) / 5)
    }
  };
  canvas.mouseUp = function() {
    canvas.mousePress = false;
    if (canvas.source === '2' || (canvas.source === '1')) {
      endLine = null;
      clearInterval(canvas.interval);
    }
  };

  canvas.addEventListener('mousedown', canvas.mouseDown);
  canvas.addEventListener('mousemove', canvas.moveOnCanvas);
  canvas.addEventListener('touchstart', canvas.mouseDown);
  canvas.addEventListener('touchmove', canvas.moveOnCanvas);

  window.addEventListener('mouseup', canvas.mouseUp);
  window.addEventListener('touchend', canvas.mouseUp);
}
