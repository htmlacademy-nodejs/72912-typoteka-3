'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const chalk = require(`chalk`);

const {
  DEFAULT_POSTS_VALUE,
  ExitCode,
  MAX_POSTS,
  PATH_OF_CATEGORIES,
  PATH_OF_SENTENCES,
  PATH_OF_TITLES,
  PATH_OF_COMMENTS,
  MAX_ID_LENGTH,
  MAX_COMMENTS
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

const generatePosts = (count, titles, sentences, categories, comments) => {
  return Array(count)
    .fill({})
    .map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
      title: titles[getRandomInt(0, titles.length - 1)],
      createDate: getRandomDate(),
      announce: shuffle(sentences).slice(1, 5).join(` `),
      fullText: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
      category: shuffle(categories).slice(0, getRandomInt(1, 3)),
    }));
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `)
  }))
);

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
    const comments = await asyncReadFile(PATH_OF_COMMENTS);

    const content = JSON.stringify(generatePosts(countPosts, titles, sentences, categories, comments));

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
