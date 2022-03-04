'use strict';

const Joi = require(`joi`);
const {CommentSchema, COMMENT_SCHEMA_TEXT_MIN} = require(`../../constans`);

module.exports = Joi.object({
  text: Joi.string().min(COMMENT_SCHEMA_TEXT_MIN).required().messages({
    'string.min': CommentSchema.TEXT_ERROR,
    'string.empty': CommentSchema.TEXT_EMPTY
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': CommentSchema.USER_ID
  })
});
