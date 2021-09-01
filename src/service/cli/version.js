'use strict';
const chalk = require(`chalk`);
const packageJsonFile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    return console.info(chalk.blue(packageJsonFile.version));
  }
};
