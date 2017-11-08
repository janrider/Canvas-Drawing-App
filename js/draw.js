var drawCanvas = function(mX, mY) {
  ctx.beginPath();

  var float = function () {
    return Math.floor((Math.random() * 10) * (Math.random() < 0.5 ? -1 : 1));
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
    return Math.floor((Math.random() * canvas.length / canvas.sizeKoof));
  };

  const line = {
    sX: point.x + lineSize() * signX,
    sY: point.y + lineSize() * signY,
    eX: point.x + lineSize() * -signX,
    eY: point.y + lineSize() * -signY,
  };

  ctx.moveTo(endLine ? endLine.x : line.sX, endLine ? endLine.y : line.sY);

  if (canvas.type === '1') {
    ctx.lineTo(line.eX, line.eY);
  } else if (canvas.type === '2') {
    line.cX1 = (line.sX + line.eX)/2 + Math.random() * 10 * signX;
    line.cY1 = (line.sY + line.eY)/2 + Math.random() * 10 * -signY;

    ctx.quadraticCurveTo(line.cX1,line.cY1,line.eX,line.eY);

    endLine = {
      x: line.eX,
      y: line.eY,
    }
  } else {
    ctx.arc(line.sX,line.sY,lineSize(10),0,2*Math.PI);
  }

  const getColor = 'rgba(' + color() + ', ' + color() + ', ' + color() + ', ' + (opacity(canvas.opacity)) + ')';

  if (canvas.type === '3') {
    ctx.fillStyle = getColor;
    ctx.fill()
  } else {
    ctx.strokeStyle = getColor;
    ctx.stroke();
  }
};
