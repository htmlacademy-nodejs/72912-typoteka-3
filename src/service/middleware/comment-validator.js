'use strict';

const {HttpCode} = require(`../../constans`);


const commentValidator = (req, res, next) => {
  const {comment} = req.body;

  if (!comment || comment.length === 0) {
    return res.status(HttpCode.BAD_REQUEST).send(`Comment is empty`);
  }

  return next();
};

module.exports = commentValidator;
