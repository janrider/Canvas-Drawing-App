const opacity = function(opacity) {
  return opacity + Math.round(Math.random() * 0.4);
};

const color = function(color) {
  return (color === options.color) ? 220 : Math.round(Math.random() * ((options.color > 0 ? 100 : 150) - 10) + 10);
};

const float = function () {
  return Math.floor((Math.random() * 10) * (Math.random() < 0.5 ? -1 : 1));
};

const sign = function() {
  return (Math.random() < 0.5 ? -1 : 1);
};

const lineSize = function() {
  return Math.floor((Math.random() * options.length / options.sizeKoof));
};


const drawCanvas = function(canvas, mX, mY) {
  const ctx = canvas.getContext("2d");
  const point = {
    x: (mX && mY) ? mX + float() : Math.floor(Math.random() * (wW) * 100) / 100,
    y: (mX && mY) ? mY + float() : Math.floor(Math.random() * (wH) * 100) / 100,
  };
  const signX = sign();
  const signY = sign();
  const line = {
    sX: point.x + lineSize() * signX,
    sY: point.y + lineSize() * signY,
    eX: point.x + lineSize() * -signX,
    eY: point.y + lineSize() * -signY,
  };

  ctx.beginPath();
  ctx.moveTo(options.endLine ? options.endLine.x : line.sX, options.endLine ? options.endLine.y : line.sY);

  if (options.type === '1') {
    ctx.lineTo(line.eX, line.eY);
  } else if (options.type === '2') {
    line.cX1 = (line.sX + line.eX)/2 + Math.random() * 10 * signX;
    line.cY1 = (line.sY + line.eY)/2 + Math.random() * 10 * -signY;

    ctx.quadraticCurveTo(line.cX1,line.cY1,line.eX,line.eY);

    options.endLine = {
      x: line.eX,
      y: line.eY,
    }
  } else {
    ctx.arc(line.sX,line.sY,lineSize(10),0,2*Math.PI);
  }

  const getColor = 'rgba(' + color('1') + ', ' + color('2') + ', ' + color('3') + ', ' + (opacity(options.opacity)) + ')';

  if (options.type === '3') {
    ctx.fillStyle = getColor;
    ctx.fill()
  } else {
    ctx.strokeStyle = getColor;
    ctx.stroke();
  }
};

function canvasInit(canvas, data) {
  canvas.width = wW;
  canvas.height = wH;

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    ctx.lineWidth = 1;
    ctx.lineJoin = ctx.lineCap = 'round';

    if (data) {
      var image = new Image
      image.src = data
      image.onload = function() {
        ctx.drawImage(image, 0, 0)
      }
    }

    // Trigger mouse
    canvas.moveOnCanvas = function(e) {
      if (options.isDraw && (options.source === '2' || (options.source === '1' && canvas.mousePress))) {
        if (intervalDraw) {
          clearInterval(intervalDraw);
        }
        drawCanvas(canvas, e.touches ? e.touches[0].pageX : e.pageX, e.touches ? e.touches[0].pageY : e.pageY)
      }
    };

    canvas.mouseDown = function(e) {
      canvas.mousePress = true;
      if (options.isDraw && options.source === '1') {
        intervalDraw = setInterval(function() {
          drawCanvas(canvas, e.touches ? e.touches[0].pageX : e.pageX, e.touches ? e.touches[0].pageY : e.pageY)
        }, Math.floor(Math.random() * (SPEED - (SPEED / 2) + (SPEED / 2)) * 100) / 5)
      }
    };
    canvas.mouseUp = function() {
      if (options.source === '2' || (options.source === '1')) {
        options.endLine = null;
        if (intervalDraw) {
          clearInterval(intervalDraw);
        }

        if (canvas.mousePress) {
          if (hash) {
            socket.emit('drawing', canvas.toDataURL());
          }

          createCanvas();
        }
      }

      canvas.mousePress = false;
      ctx.restore();
    };

    canvas.addEventListener('mousedown', canvas.mouseDown);
    canvas.addEventListener('mousemove', canvas.moveOnCanvas);
    canvas.addEventListener('touchstart', canvas.mouseDown);
    canvas.addEventListener('touchmove', canvas.moveOnCanvas);

    window.addEventListener('mouseup', canvas.mouseUp);
    window.addEventListener('touchend', canvas.mouseUp);
  }
}
