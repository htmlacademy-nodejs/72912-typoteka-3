'use strict';

const pino = require(`pino`);
const {PATH_OF_API_LOG, Env} = require(`../../constans`);
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;

const defaultLogLevel = isDevMode ? `debug` : `error`;

const logger = pino(
    {
      name: `base-logger`,
      level: process.env.LOG_LEVEL || defaultLogLevel,
      prettyPrint: isDevMode
    },
    isDevMode ? process.stdout : pino.destination(PATH_OF_API_LOG)
);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};

