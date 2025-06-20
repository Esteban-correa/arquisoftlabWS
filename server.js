const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const path = require('path');

app.use(express.static(__dirname)); // sirve archivos desde la raíz actual

// Ruta principal que devuelve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Un usuario se conectó');

  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data); // envía a todos menos al emisor
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

server.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
