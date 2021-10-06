'use strict';

const {HttpCode} = require(`../../constans`);

const articleKeys = [`title`, `createDate`, `announce`, `fullText`, `category`];

const articleValidator = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};

module.exports = articleValidator;
