'use strict';

const crc32 = require('js-crc').crc32;
const os = require('os');
const request = require('request');
const https = require('https');

var public_ip = '';
https.get('https://api.ipify.org', (res) => {
  //console.log('statusCode:', res.statusCode);
  //console.log('headers:', res.headers);

  res.on('data', (d) => {
    public_ip = d;
  });

}).on('error', (e) => {
  console.error(e);
});

var inter = os.networkInterfaces();

const device = {};

device.hostname = os.hostname();

for (var i in inter) {
  for (var j in inter[i]) {
    var address = inter[i][j];
    if (address.family === 'IPv4' && !address.internal) {
      device.device = crc32(address.mac).toUpperCase();
      device.local_ip = address.address;
      device.public_ip = public_ip;//request.get('http://api.ipify.org');
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
