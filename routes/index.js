let router = require('express').Router();
let redis;

router.get('/', (req, res) => {
  res.render('index', { title: 'Bauart test server' });
});

const NASA = require('../query/nasa');

router.post('/apod', NASA.addAPOD);
router.post('/earth', NASA.addEarth);
router.post('/mars', NASA.addMars);

const io = require('socket.io')();

io.on('connection', (socket) => {
  console.log('Connected to Socket.io...');
  redis = require('redis').createClient();
  redis.on('connect', () => {
    console.log('Connected to Redis...');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.io...');
  });

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
});

// const addMessageToRedis = (room, message) => {
// redis.set(room, 'Hello Redis', function(err, repl) {
//   if (err) {
//     // Оо что то случилось при записи
//     console.log('Что то случилось при записи: ' + err);
//     redis.quit();
//   } else {
//     // Прочтем записанное
//     redis.get('myKey', function(err, repl) {
//       //Закрываем соединение, так как нам оно больше не нужно
//       redis.quit();
//       if (err) {
//         console.log('Что то случилось при чтении: ' + err);
//       } else if (repl) {
//         // Ключ найден
//         console.log('Ключ: ' + repl);
//       } else {
//         // Ключ ненайден
//         console.log('Ключ ненайден.');
//
//       }
//       ;
//     });
//   }
//   ;
// });
// };

module.exports = { router, io };
