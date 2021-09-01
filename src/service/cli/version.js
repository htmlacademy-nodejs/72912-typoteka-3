'use strict';

const packageJsonFile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    return console.info(packageJsonFile.version);
  }
};
