const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;

const history = new Object();
const roomsList = [];

app.use(express.static(__dirname + '/src'));

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

    return socket.broadcast.to(roomName).emit('drawing', data);
  })

  setInterval(() => {
    roomsList.forEach(room => {
      if (!io.sockets.adapter.rooms[room] || io.sockets.adapter.rooms[room].length === 0) {
        delete history[room];
      }
    })
  }, 5000);
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));

app.get('/history', function(req, res){
  const roomName = req.query.room;

  res.send({
    data: history[roomName]
  });
});
