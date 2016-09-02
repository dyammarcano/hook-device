'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  server: "http://node-5622245.rhcloud.com:8000",
  cert: {
    key: fs.readFileSync(path.resolve('./src/config/certificate/key.pem')),
    cert: fs.readFileSync(path.resolve('./src/config/certificate/cert.pem'))
  },
  ssh: {
    user: 'root@localhost',
    port: 2222
  },
  pty: {
    name: 'xterm-256color',
    cols: 80,
    rows: 30
  },
  port: 5729
};
