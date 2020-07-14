const router = require('express').Router();
const io = require('socket.io')();
const redis = require('redis').createClient();

router.get('/', (req, res) => {
  res.render('index', { title: 'Bauart test server' });
});

const NASA = require('../query/nasa');

router.post('/apod', NASA.addAPOD);
router.post('/earth', NASA.addEarth);
router.post('/mars', NASA.addMars);

io.on('connection', (socket) => {
  socket.on('userJoined', (user) => {
    socket.join(user.room);

    redis.lrange(user.room, 0, -1, (error, reply) => {
      if (reply.length > 0) {
        for (let i = 0; i < reply.length; i++) {
          socket.emit('message', JSON.parse(reply[i]));
        }
      }
    });

    socket.broadcast
        .to(user.room)
        .emit('message', {
          name: user.name,
          text: `присоединился к ${ user.room }`
        });
  });

  socket.on('message', (message) => {
    const response = {
      name: message.name,
      date: message.date || new Date(),
      text: message.text
    };

    redis.rpush(message.room, JSON.stringify(response));

    io.sockets.to(message.room).emit('message', response);
  });

  socket.on('logout', (user) => {
    socket.broadcast
        .to(user.room)
        .emit('message', {
          name: user.name,
          text: `вышел из ${ user.room }`
        });
  });
});

module.exports = { router, io };
