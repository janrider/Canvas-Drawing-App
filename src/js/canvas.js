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

function repeatOften(func) {
  func
  requestAnimationFrame(repeatOften);
}

const drawCanvas = function(canvas, mX, mY, data) {
  const ctx = canvas.getContext("2d");
  const point = data ? data.point : {
    x: (mX && mY) ? mX + float() : Math.floor(Math.random() * (wW) * 100) / 100,
    y: (mX && mY) ? mY + float() : Math.floor(Math.random() * (wH) * 100) / 100,
  };
  const signX = data ? data.signY : sign();
  const signY = data ? data.signY : sign();
  const line = data ? data.line : {
    sX: point.x + lineSize() * signX,
    sY: point.y + lineSize() * signY,
    eX: point.x + lineSize() * -signX,
    eY: point.y + lineSize() * -signY,
  };
  const type = data ? data.type : options.type;
  const radius = data ? data.radius : lineSize(10);

  ctx.beginPath();
  ctx.moveTo(options.endLine ? options.endLine.x : line.sX, options.endLine ? options.endLine.y : line.sY);

  if (type === '1') {
    ctx.lineTo(line.eX, line.eY);
  } else if (type === '2') {
    line.cX1 = (line.sX + line.eX)/2 + Math.random() * 10 * signX;
    line.cY1 = (line.sY + line.eY)/2 + Math.random() * 10 * -signY;

    ctx.quadraticCurveTo(line.cX1,line.cY1,line.eX,line.eY);

    options.endLine = {
      x: line.eX,
      y: line.eY,
    }
  } else {
    ctx.arc(line.sX,line.sY,radius,0,2*Math.PI);
  }

  const getColor = data ? data.color : 'rgba(' + color('1') + ', ' + color('2') + ', ' + color('3') + ', ' + (opacity(options.opacity)) + ')';

  if (type === '3') {
    ctx.fillStyle = getColor;
    ctx.fill()
  } else {
    ctx.strokeStyle = getColor;
    ctx.stroke();
  }

  if (data) return null;

  return {
    type: options.type,
    point,
    line,
    signX,
    signY,
    radius,
    color: getColor
  };
};

function mapData(canvas, data, isHistory) {
  data.forEach((item, idx) => {
    if (isHistory) {
      drawCanvas(canvas, null, null, item)

      if (idx === data.length -1) {
        createImage(canvas.toDataURL());
      }
    } else {
      repeatOften(setTimeout(function(){
        drawCanvas(canvas, null, null, item)

        if (idx === data.length -1) {
          createImage(canvas.toDataURL());
        }
      }, 1000/60 * idx));
    }
  })
}

function canvasInit(canvas, data, isHistory) {
  canvas.width = wW;
  canvas.height = wH;
  var dataList = [];

  if (isHistory) {
    data.forEach(item => {
      dataList = dataList.concat(item)
    });
  }

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    ctx.lineWidth = 1;
    ctx.lineJoin = ctx.lineCap = 'round';

    if (data) {
      mapData(canvas, isHistory ? dataList : data, isHistory);
    } else {
      canvas.classList.add('active');

      const drawing = [];

      canvas.moveOnCanvas = function(e) {
        if (options.isDraw && (options.source === '2' || (options.source === '1' && canvas.mousePress))) {
          if (intervalDraw) {
            clearInterval(intervalDraw);
          }
          const res = drawCanvas(canvas, e.touches ? e.touches[0].pageX : e.pageX, e.touches ? e.touches[0].pageY : e.pageY)
          if (res) {
            drawing.push(res);
          }
        }
      };

      canvas.mouseDown = function(e) {
        if (e.which === 1) {
          canvas.mousePress = true;
          if (options.isDraw && options.source === '1') {
            intervalDraw = setInterval(function() {
              const res = drawCanvas(canvas, e.touches ? e.touches[0].pageX : e.pageX, e.touches ? e.touches[0].pageY : e.pageY)
              if (res) {
                drawing.push(res);
              }
            }, Math.floor(Math.random() * (SPEED - (SPEED / 2) + (SPEED / 2)) * 100) / 5)
          }
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
              socket.emit('drawing', drawing);
            }

            canvas.removeEventListener('mousedown', this, false);
            canvas.removeEventListener('touchstart', this, false);
            canvas.removeEventListener('mousemove', this, false);
            canvas.removeEventListener('touchmove', this, false);
            canvas.removeEventListener('mouseup', this, false);
            canvas.removeEventListener('touchend', this, false);

            createImage(canvas.toDataURL(), true);
          }
        }

        canvas.mousePress = false;
        ctx.restore();
      };

      canvas.addEventListener('mousedown', canvas.mouseDown);
      canvas.addEventListener('touchstart', canvas.mouseDown);
      canvas.addEventListener('mousemove', canvas.moveOnCanvas);
      canvas.addEventListener('touchmove', canvas.moveOnCanvas);
      canvas.addEventListener('mouseup', canvas.mouseUp);
      canvas.addEventListener('touchend', canvas.mouseUp);
    }
  }
}
