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
  MAX_COMMENTS,
  MIN_ANNOUNCE_STRINGS,
  MAX_ANNOUNCE_STRINGS,
  MIN_COMMENT_STRINGS,
  MAX_COMMENT_STRINGS,
  MIN_PICTURE_NUMBER,
  MAX_PICTURE_NUMBER
} = require(`../../constans`);

const {getRandomInt, shuffle, getRandomDate} = require(`../../utils`);

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  }, {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const asyncReadFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.info(chalk.red(err));
    return [];
  }
};

const generatePosts = (count, titles, sentences, userCount, categories, comments) => {
  return Array(count)
    .fill({})
    .map((_, index) => ({
      userId: getRandomInt(1, userCount),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, userCount, index + 1),
      title: titles[getRandomInt(0, titles.length - 1)],
      createDate: getRandomDate(),
      announce: shuffle(sentences).slice(MIN_ANNOUNCE_STRINGS, MAX_ANNOUNCE_STRINGS).join(` `),
      fullText: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
      category: [getRandomInt(1, categories.length)],
      picture: `avatar-${getRandomInt(MIN_PICTURE_NUMBER, MAX_PICTURE_NUMBER)}.png`,
    }));
};

const generateComments = (count, comments, userCount, id) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId: id,
    text: shuffle(comments)
      .slice(0, getRandomInt(MIN_COMMENT_STRINGS, MAX_COMMENT_STRINGS))
      .join(` `)
  }))
);

module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;
    const countPosts = Number.parseInt(count, 10) || DEFAULT_POSTS_VALUE;

    if (countPosts > MAX_POSTS) {
      console.info(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.ERROR);
    }

    const titles = await asyncReadFile(PATH_OF_TITLES);
    const sentences = await asyncReadFile(PATH_OF_SENTENCES);
    const categories = await asyncReadFile(PATH_OF_CATEGORIES);
    const commentSentences = await asyncReadFile(PATH_OF_COMMENTS);


    const articles = generatePosts(countPosts, titles, sentences, users.length, categories, commentSentences);


    const comments = articles.flatMap((article) => article.comments);

    const articlesCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.category[0]}));

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, createDate, announce, fullText, picture, userId}) =>
          `('${title}', '${createDate}', '${picture}', '${announce}', '${fullText}',  ${userId})`
    ).join(`,\n`);

    const articleCategoryValues = articlesCategories.map(({articleId, categoryId}) => `(${articleId}, ${categoryId})`).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, articleId}) => `('${text}', ${userId}, ${articleId})`
    ).join(`,\n`);


    const content = `
    INSERT INTO categories(name) VALUES
    ${categoryValues};
    INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
    ${userValues};
    ALTER TABLE articles DISABLE TRIGGER ALL;
    INSERT INTO articles(title, create_at, picture, announce, full_text, user_id) VALUES
    ${articleValues};
    ALTER TABLE articles ENABLE TRIGGER ALL;
    INSERT INTO comments(text, user_id, article_id) VALUES
    ${commentValues};
    ALTER TABLE comments ENABLE TRIGGER ALL;
    ALTER TABLE articles_categories DISABLE TRIGGER ALL;
    INSERT INTO articles_categories(article_id, category_id) VALUES
    ${articleCategoryValues};
    ALTER TABLE articles_categories ENABLE TRIGGER ALL;
    ALTER TABLE comments DISABLE TRIGGER ALL;`;


    try {
      await fs.writeFile(`generate-fill-db.sql`, content);
      console.info(chalk.green(`Operation success. File created`));
      process.exit(ExitCode.SUCCESS);
    } catch (err) {
      console.info(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }

  }
};
