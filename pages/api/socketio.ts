import { Server } from 'socket.io';

const users = {};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server(res.socket.server);

    io.on('connection', socket => {
      socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
      });
      socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', {message, name: users[socket.id]});
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler;