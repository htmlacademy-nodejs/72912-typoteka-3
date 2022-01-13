'use strict';

const Joi = require(`joi`);
const {CommentSchema} = require(`../../constans`);

module.exports = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.min': CommentSchema.TEXT_ERROR
  })
});
