'use strict';

const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const io = require('socket.io-client');
const cache = require('memory-cache');
const _ = require('lodash');
const moment = require('moment');
const device = require('./lib/interface');
const cfg = require('./config');

let app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

const server = require('https').createServer(cfg.cert, app).listen(cfg.port, () => {
  console.log('http on port ' + cfg.port);
});

let sio = socketio(server, { path: '/wetty/socket.io' });

sio.on('connection', (socket) => {
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

const cio = io(cfg.server);

cio.on('connect', () => {
  cio.emit('device', device);
  console.log(`Connection: ${ new Date() }`);
  console.log(device);

  cio.on('device', (data) => {
    cache.put('id', data.id);
    console.log(`id: ${ cache.get('id') }`);
  });

  cio.on('message', (data) => {
    console.log(data);
  });

  cio.on('timestamp', (data) => {
    //console.log(data);
  });

  cio.on('disconnect', () => {
    console.log(`server disconnect: ${ new Date() }`);
  });

  cio.on('logs', (data) => {
    console.log(`logs: ${ data }`);
  });
});
