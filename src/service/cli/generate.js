'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  DEFAULT_POSTS_VALUE,
  ExitCode,
  MAX_POSTS,
  PATH_OF_CATEGORIES,
  PATH_OF_SENTENCES,
  PATH_OF_TITLES
} = require(`../../constans`);

const {getRandomInt, shuffle, getRandomDate} = require(`../../utils`);

const asyncReadFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.info(chalk.red(err));
    return [];
  }
};

const generatePosts = (count, titles, sentences, categories) => {
  return Array(count)
    .fill({})
    .map(() => ({
      title: titles[getRandomInt(0, titles.length - 1)],
      createDate: getRandomDate(),
      announce: shuffle(sentences).slice(1, 5).join(` `),
      fullText: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
      category: shuffle(categories).slice(0, getRandomInt(1, 3))
    }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countPosts = Number.parseInt(count, 10) || DEFAULT_POSTS_VALUE;

    if (countPosts > MAX_POSTS) {
      console.info(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }

    const titles = await asyncReadFile(PATH_OF_TITLES);
    const sentences = await asyncReadFile(PATH_OF_SENTENCES);
    const categories = await asyncReadFile(PATH_OF_CATEGORIES);

    const content = JSON.stringify(generatePosts(countPosts, titles, sentences, categories));

    try {
      await fs.writeFile(`mock.json`, content);
      console.info(chalk.green(`Operation success. File created`));
      process.exit(ExitCode.succes);
    } catch (err) {
      console.info(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }

  }
};
