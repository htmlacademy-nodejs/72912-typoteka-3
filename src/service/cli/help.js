'use strict';
const chalk = require(`chalk`);

const helpMessage = `
 Программа запускает http-сервер и заполняет локальную БД данными для API.

     Гайд:
     service.js <command>
     Команды:
      --version: выводит номер версии
      --help: печатает этот текст
      --filldb <count> заполняет локальную БД
`;

module.exports = {
  name: `--help`,
  run() {
    return console.info(chalk.gray(`${helpMessage}`));
  }
};
