const { Server } = require('socket.io');
const cors = require('cors');

const io = new Server({
  cors: {
    origin: "http://127.0.0.1:5500", 
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on('connection', socket => {
  socket.on('newUserJoined', name => {
    // console.log("New user", name);
    users[socket.id] = name;
    socket.broadcast.emit('userJoined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', message =>{
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  })

});

const PORT = 8000;

io.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
