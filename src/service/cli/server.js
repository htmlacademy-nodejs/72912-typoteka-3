'use strict';

const fs = require(`fs`).promises;
const express = require(`express`);
const chalk = require(`chalk`);
const {DEFAULT_PORT, HttpCode} = require(`../../constans`);

const app = express();
app.use(express.json());

app.get(`/posts`, async (req, res) => {
  try {
    const content = await fs.readFile(`mock.json`, `utf-8`);
    const mocks = JSON.parse(content);
    res.json(mocks);
  } catch (err) {
    res.send([]);
  }
});

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
