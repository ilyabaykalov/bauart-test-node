let router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Bauart test server' });
});

const redis = require('redis').createClient();
redis.on('connect', () => {
  console.log('Connected to Redis...');
});

const NASA = require('../query/nasa');

router.post('/apod', NASA.addAPOD);
router.post('/earth', NASA.addEarth);
router.post('/mars', NASA.addMars);

const io = require('socket.io')();

io.on('connection', (socket) => {
  console.log('Connected to Socket.io...');

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.io...');
  });

  socket.on('userJoined', (user) => {
    socket.join(user.room);
    socket.broadcast.to(user.room)
        .emit('message', {
          name: user.name,
          text: `присоединился к ${ user.room }`
        });
  });

  socket.on('message', (message) => {
    io.sockets.to(message.room).emit('message', {
      name: message.name,
      date: new Date(),
      text: message.text
    });
  });
});

module.exports = { router, io };
