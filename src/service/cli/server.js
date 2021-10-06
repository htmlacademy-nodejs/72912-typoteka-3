'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {DEFAULT_PORT, HttpCode, API_PREFIX} = require(`../../constans`);
const routes = require(`../api`);

const app = express();
app.use(express.json());

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
});

module.exports = {
  name: `--server`,
  run(args) {
    const port = parseInt(args, 10) || DEFAULT_PORT;
    app
      .listen(port, () => {
        console.info(`Ожидаю соединений на ${port}`);
      })
      .on(`error`, ({message}) => {
        console.info(chalk.red(`Ошибка при создании сервера: ${message}`));
      });
  }
};
