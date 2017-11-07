var canvas = document.querySelector("#canvas");
var nav = document.querySelector("nav");

var wW = window.innerWidth;
var wH = window.innerHeight;

canvas.width = wW;
canvas.height = wH;

canvas.isDraw = false;
canvas.source = 0;

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

  canvas.drawLine = function() {
    ctx.beginPath();
    ctx.moveTo(wW * koof(), wH * koof());
    ctx.lineTo(wW * koof(), wH * koof());
    ctx.strokeStyle = 'rgba(' + color() + ', ' + color() + ', ' + color() + ', ' + (C(canvas.opacity)) + ')';
    ctx.stroke();
  }

  canvas.moveOnCanvas = function() {
    if (canvas.isDraw && canvas.source == 1) {
      canvas.drawLine()
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

      if (canvas.source === 0) {
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
}
