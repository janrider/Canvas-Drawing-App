const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;
const history = new Object();

app.use(express.static(__dirname + '/src'));

function onConnection(socket){
  var roomName = '';

  socket.on('room', function(room) {
    roomName = room;
    socket.join(room);
  });

  socket.on('drawing', (data) => {
    if (!history[roomName]) {
      history[roomName] = [];
    }
    history[roomName].push(data);

    return socket.broadcast.to(roomName).emit('drawing', { data, history: history[roomName] });
  })
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));