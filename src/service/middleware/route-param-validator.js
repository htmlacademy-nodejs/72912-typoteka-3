'use strict';

const {HttpCode} = require(`../../constans`);

module.exports = (schema) => async (req, res, next) => {
  const id = parseInt(req.params.articleId, 10);

  try {
    await schema.validateAsync(id);
  } catch (e) {
    const {details} = e;
    return res.status(HttpCode.NOT_FOUND).send(details.map((err) => err.message).join(`\n`));
  }
  return next();
};
