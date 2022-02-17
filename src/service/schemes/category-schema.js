'use strict';

const Joi = require(`joi`);
const {CategorySchema} = require(`../../constans`);

module.exports = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    'string.min': CategorySchema.TEXT_MIN,
    'string.max': CategorySchema.TEXT_MAX,
    'string.empty': CategorySchema.TEXT_EMPTY
  })
});
