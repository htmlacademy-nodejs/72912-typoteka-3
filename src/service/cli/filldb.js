'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  DEFAULT_POSTS_VALUE,
  ExitCode,
  MAX_POSTS,
  PATH_OF_CATEGORIES,
  PATH_OF_SENTENCES,
  PATH_OF_TITLES,
  PATH_OF_COMMENTS,
  MAX_COMMENTS
} = require(`../../constans`);

const {getRandomInt, shuffle} = require(`../../utils`);

const {getLogger} = require(`../lib/logger`);
const logger = getLogger({name: `api`});

const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const passwordUtils = require(`../lib/password`);


const asyncReadFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.info(chalk.red(err));
    return [];
  }
};

const generatePosts = (count, titles, sentences, categories, comments, users) => {
  return Array(count)
    .fill({})
    .map(() => ({
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences).slice(1, 5).join(` `),
      fullText: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
      categories: getRandomSubarray(categories),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, users),
      user: users[getRandomInt(0, users.length - 1)].email
    }));
};

const generateComments = (count, comments, users) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
    user: users[getRandomInt(0, users.length - 1)].email
  }))
);

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

module.exports = {
  name: `--filldb`,
  async run(args) {

    try {
      logger.info(chalk.yellowBright(`Соединение с БД...`));
      await sequelize.authenticate();
    } catch (err) {
      logger.info(chalk.red(`Не удалось установить соединение с БД: ${err.message}`));
      process.exit(1);
    }

    logger.info(chalk.green(`Соединение с БД установлено`));


    const [count] = args;
    const countPosts = Number.parseInt(count, 10) || DEFAULT_POSTS_VALUE;

    if (countPosts > MAX_POSTS) {
      console.info(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }

    const titles = await asyncReadFile(PATH_OF_TITLES);
    const sentences = await asyncReadFile(PATH_OF_SENTENCES);
    const categories = await asyncReadFile(PATH_OF_CATEGORIES);
    const comments = await asyncReadFile(PATH_OF_COMMENTS);

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`qwert1234`),
        name: `Иван`,
        surname: `Иванов`,
        avatar: `avatar1.jpg`,
        role: `admin`
      }, {
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`artbook99`),
        name: `Пётр`,
        surname: `Петров`,
        avatar: `avatar2.jpg`,
        role: `server`
      }
    ];

    const articles = generatePosts(countPosts, titles, sentences, categories, comments, users);

    return initDatabase(sequelize, {articles, categories, users});
  }
};
