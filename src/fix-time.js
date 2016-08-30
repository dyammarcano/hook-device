const setup = require('setup')();
const _ = require('lodash');
const moment = require('moment');
const execFile = require('child_process').execFile;

module.exports = (time) => {
  let instanceFix = () => {
    console.log(`updating local time`);
    execFile('node', ['--version'], (error, stdout, stderr) => {
      if (error) {
        throw error;
      }

      console.log(stdout);
    });
  };

  var runOnce = _.once(instanceFix);

  if (_.gte(time, moment().unix())) {
    runOnce();
  }
};
