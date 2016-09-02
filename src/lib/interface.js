'use strict';

const crc32 = require('js-crc').crc32;
const os = require('os');

var inter = os.networkInterfaces();

const device = {};

device.hostname = os.hostname();

for (var i in inter) {
  for (var j in inter[i]) {
    var address = inter[i][j];
    if (address.family === 'IPv4' && !address.internal) {
      device.device = crc32(address.mac).toUpperCase();
      device.local_ip = address.address;
      device.public_ip = '';
      device.netmask = address.netmask;
      device.mac = address.mac;
    }
  }
}

device.hostname = os.hostname();
device.uptime = os.uptime();
device.freemem = os.freemem();
device.totalmem = os.totalmem();
device.type = os.type();
device.release = os.release();
device.arch = os.arch();
device.platform = os.platform();

module.exports = device;
