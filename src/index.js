"use strict";

const io = require('socket.io-client');
const cache = require('memory-cache');
const _ = require('lodash');
const moment = require('moment');
const device = require('./interface');
const cfg = require('./config');

const socket = io(cfg.server);

socket.on('connect', () => {
  socket.emit('device', device);
  console.log(`Connection: ${ new Date() }`);
  console.log(device);
});

socket.on('timestamp', (data) => {
  //fixTime(data);
});

socket.on('device', (data) => {
  //console.log(data);
  cache.put('id', data.id);
  console.log(`id: ${cache.get('id')}`);
});

socket.on('message', (data) => {
  console.log(data);
});

/*socket.on('timestamp', (data) => {
  console.log(data);
});*/

socket.on('disconnect', () => {
  console.log(`server disconnect: ${ new Date() }`);
});

socket.on('logs', (data) => {
  console.log(`logs: ${data}`);
});
