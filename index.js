const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;
const APP_SRC = app.settings.env === 'development' ? '/src' : '/public';

const history = new Object();
const roomsList = [];

app.use(express.static(__dirname + APP_SRC));

function onConnection(socket){
  var roomName = '';

  socket.on('room', function(room) {
    roomName = room;
    roomsList.push(roomName);
    socket.join(room);
  });

  socket.on('drawing', (data) => {
    if (!history[roomName]) {
      history[roomName] = [];
    }
    history[roomName].push(data);
    if (history[roomName].length > 50) {
      history[roomName].splice(0, history[roomName].length - 50);
    }

    return socket.broadcast.to(roomName).emit('drawing', data);
  })
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));

app.get('/history', function(req, res){
  const roomName = req.query.room;

  res.send({
    data: history[roomName]
  });
});
