'use strict';

const express = require(`express`);
const http = require(`http`);
const socket = require(`../lib/socket`);

const chalk = require(`chalk`);
const {DEFAULT_PORT, HttpCode, API_PREFIX} = require(`../../constans`);
const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});
const routes = require(`../api`);
const sequelize = require(`../lib/sequelize`);

const app = express();
const server = http.createServer(app);
const io = socket(server);
app.locals.socketio = io;

app.use(express.json());

app.use(API_PREFIX, routes);

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });

  next();
});

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
  logger.error(`Router not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.messgae}`);
});

module.exports = {
  name: `--server`,
  async run(args) {

    try {
      logger.info(chalk.yellowBright(`Соединение с БД...`));
      await sequelize.authenticate();
    } catch (err) {
      logger.info(chalk.red(`Не удалось установить соединение с БД: ${err.message}`));
      process.exit(1);
    }

    logger.info(chalk.green(`Соединение с БД установлено`));

    const port = parseInt(args, 10) || DEFAULT_PORT;
    server
      .listen(port, () => {
        logger.info(`Ожидаю соединений на ${port}`);
      })
      .on(`error`, ({message}) => {
        logger.info(chalk.red(`Ошибка при создании сервера: ${message}`));
      });
  }
};
