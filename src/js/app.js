var layers = [];
var num = 0;
var canvasId = "#canvas";
var wW = window.innerWidth;
var wH = window.innerHeight;
var nav = document.querySelector("nav");
var intervalDraw;
var socket;
var hash = window.location.hash.substr(1);

const SPEED = 1;
const options = {
  opacity: 0.6,
  length: 120,
  color: '0',
  source: '1',
  type: '3',
  isDraw: true,
  mousePress: false,
  endLine: null
};
options.sizeKoof = options.type === '3' ? 5 : 2;


const setColor = function(colorSelect) {
  options.color = colorSelect.value;
};

const setOpacity = function (slider) {
  options.opacity = slider.value;
};

const setLength = function (slider) {
  options.length = slider.value;
};

const setSource = function(selectObject) {
  clearInterval(intervalDraw);

  options.source = selectObject.value;
  options.endLine = null;

  if (options.source == '0') {
    nav.classList.remove('mouse');
    setDraw(false);
  } else {
    nav.classList.add('mouse');
    setDraw(true);
  }
};

const setType = function(lineType) {
  options.type = lineType.value;
  options.endLine = null;
  options.sizeKoof = (lineType.value === '3') ? 5 : 2;
};

const setDraw = function(val) {
  options.isDraw = val;
  const canvas = document.getElementById(layers[layers.length - 1]);

  if (document.getElementById("undoBtn")) {
    document.getElementById("undoBtn").disabled = val;
  }

  if (val) {
    nav.classList.add('active')

    if (options.source === '0') {
      intervalDraw = setInterval(function() {
        drawCanvas(canvas)
      }, Math.floor(Math.random() * (SPEED - (SPEED / 2) + (SPEED / 2)) * 100) / 100)
    }
  } else {
    nav.classList.remove('active')
    if (intervalDraw) {
      clearInterval(intervalDraw);
    }

    if (hash) {
      socket.emit('drawing', canvas.toDataURL());
    }

    addCanvas();
  }
};

var addCanvas = function() {
  var wrapper = document.querySelector("#wrapper");
  var node = document.createElement("canvas");

  canvasId = "canvas" + num;
  node.setAttribute("id", canvasId);
  wrapper.appendChild(node);

  var canvas = document.getElementById(canvasId);
  layers.push(canvasId);

  if (layers.length > 1 && document.getElementById("undoBtn")) {
    document.getElementById("undoBtn").disabled = false;
  }
  
  canvasInit(canvas)

  num++;
};

var createCanvasByData = function(data, isHistory, isImport) {
  var wrapper = document.querySelector("#wrapper");
  var node = document.createElement("canvas");
  
  canvasId = "canvas" + num;
  node.setAttribute("id", canvasId);
  if (isImport || isHistory) {
    node.classList.add('temp');
  }
  wrapper.appendChild(node);
  
  var canvas = document.getElementById(canvasId);
  layers.push(canvasId);
  
  if (layers.length > 1 && document.getElementById("undoBtn")) {
    document.getElementById("undoBtn").disabled = false;
  }
  
  canvasInit(canvas, data, isHistory)
  
  num++;
};

var createImage = function(data, createNew) {
  var wrapper = document.querySelector("#wrapper");
  var node = document.createElement("img");
  node.src = data;

  const tempNodes = wrapper.querySelectorAll('canvas:not(.active)');
  const nodesList = wrapper.querySelectorAll('canvas:not(.temp)');


  if (createNew) {
    nodesList.forEach(e => e.parentNode.removeChild(e));
  } else {
    tempNodes.forEach(e => e.parentNode.removeChild(e));
  }

  wrapper.appendChild(node);

  if (createNew) {
    addCanvas();
  }
};

var deleteLayer = function(isCanvas) {
  if (isCanvas) {
    var canvas = document.querySelector('canvas.active');
    canvas.remove();

    return;
  }

  var images = document.getElementById('wrapper').querySelectorAll('img');
  images[0].parentNode.removeChild(images[images.length - 1]);
  // lastImage.remove();

  // node.remove();
  //
  // layers.splice(layers.length - 2 + (n ? n : 0), 1);
  //
  // if (layers.length < 2 && document.getElementById("undoBtn")) {
  //   document.getElementById("undoBtn").disabled = true;
  // }
  //
  // if(layers.length === 0) {
  //   addCanvas();
  // }
};

function clearAll() {
  var wrapper = document.getElementById('wrapper');
  wrapper.querySelectorAll('img').forEach(e => e.parentNode.removeChild(e))
}

window.addEventListener('keydown', function(e) {
  var evtobj = window.event ? event : e

  if (evtobj.keyCode == 90 && evtobj.ctrlKey) {

    if (layers.length > 1) {
      deleteLayer();
    }
  }
});

function debounce(func) {
  var timer;

  return function(event) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(func, 300, event);
  };
}

window.addEventListener("resize", debounce(function() {
  wW = window.innerWidth;
  wH = window.innerHeight;

  deleteLayer(true);
  addCanvas();
}));

var onDrawingEvent = function(data) {
  createCanvasByData(data, false, true);
};

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

function startSocket(hash) {
  socket = io.connect();
  var room = 'room-' + hash;

  socket.on('connect', function() {
    socket.emit('room', room);
  });

  socket.on('drawing', onDrawingEvent);

  const history = JSON.parse(httpGet('/history?room=' + room)).data;

  if (history && history.length > 0) {
    createCanvasByData(history, true);
  }
}

function sharePano(link) {
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4();
  }

  const hash = guid();

  link.href = window.location + '#' + hash
}

function init() {
  wW = window.innerWidth;
  wH = window.innerHeight;

  if (hash) {
    document.getElementById('clearBtn').remove();
    document.getElementById('undoBtn').remove();
    document.getElementById('shareBtn').remove();
    startSocket(hash);
  }

  nav = document.querySelector("nav");

  addCanvas();
}
