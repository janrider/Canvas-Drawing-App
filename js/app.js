var canvas = document.querySelector("#canvas");
var nav = document.querySelector("nav");

var wW = window.innerWidth;
var wH = window.innerHeight;

canvas.width = wW;
canvas.height = wH;

canvas.isDraw = false;
canvas.source = '0';

if (canvas.getContext) {
  var ctx = canvas.getContext("2d");

  var koof = function() {
    return Math.round(Math.random() * 1000) / 1000;
  }
  var C = function(opacity) {
    return opacity + Math.round(Math.random()) * 0.4;
  }
  var color = function() {
    return Math.round(Math.random() * (120 - 10) + 10);
  }

  const SPEED = 1;

  canvas.opacity = 0.2;

  canvas.setOpacity = function (slider) {
    canvas.opacity = slider.value;
  }

  canvas.drawLine = function(mX, mY) {
    ctx.beginPath();
    var line = {
      sX: wW * koof(),
      sY: wH * koof(),
      eX: wW * koof(),
      eY: wH * koof(),
    }

    if (mX && canvas.source === '2') {
      var S = function() {
        return Math.floor((Math.random() * (40 - 5) + 5) * (Math.random() < 0.5 ? -1 : 1));
      };
      var kX = line.sX - line.eX;
      var kY = line.sY - line.eY;
      var newLine = {
        sX: mX + S() - kX / 2,
        sY: mY + S() - kY / 2,
        eX: mX + S() + kX / 2,
        eY: mY + S() + kY / 2,
      };
      ctx.moveTo(newLine.sX, newLine.sY);
      ctx.lineTo(newLine.eX, newLine.eY);
    } else {
      ctx.moveTo(line.sX, line.sY);
      ctx.lineTo(line.eX, line.eY);
    }

    ctx.strokeStyle = 'rgba(' + color() + ', ' + color() + ', ' + color() + ', ' + (C(canvas.opacity)) + ')';
    ctx.stroke();
  }

  canvas.moveOnCanvas = function(e) {
    if (canvas.isDraw && canvas.source > 0) {
      canvas.drawLine(e.pageX, e.pageY)
    }
  }

  canvas.setSource = function(selectObject) {
    canvas.source = selectObject.value;
  }

  canvas.setDraw = function(val) {
    canvas.isDraw = val;
    document.getElementById("startBtn").disabled = val;
    document.getElementById("selectBtn").disabled = val;
    document.getElementById("clearBtn").disabled = val;
    if (val) {
      nav.classList.add('active')

      if (canvas.source === '0') {
        canvas.interval = setInterval(function() {
          canvas.drawLine()
        }, SPEED)
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

  canvas.addEventListener('mousemove', function(e){
    canvas.moveOnCanvas(e);
  })
}
