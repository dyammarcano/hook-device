'use strict';

const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const cfg = require('./config');

let app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

const server = require('https').createServer(cfg.cert, app).listen(cfg.port, () => {
  console.log('http on port ' + cfg.port);
});

let io = socketio(server, { path: '/wetty/socket.io' });

io.on('connection', (socket) => {
  console.log(`${ new Date() } Connection accepted.`);

  let term = require('pty.js').spawn('ssh', [
      'root@localhost',
      '-p',
      cfg.ssh.port,
      '-o',
      'PreferredAuthentications=password,keyboard-interactive'
    ],
    cfg.pty);

  console.log(`${ new Date() } PID=${ term.pid } STARTED on behalf of user=${ cfg.ssh.user }`);

  term.on('data', (data) => {
    socket.emit('output', data);
  });

  term.on('exit', (code) => {
    console.log(`${ new Date() } PID=${ term.pid } ENDED`);
  });

  socket.on('resize', (data) => {
    term.resize(data.col, data.row);
  });

  socket.on('input', (data) => {
    term.write(data);
  });

  socket.on('disconnect', () => {
    term.end();
  });
});
