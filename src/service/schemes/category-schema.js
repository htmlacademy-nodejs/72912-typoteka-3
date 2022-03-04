'use strict';

const Joi = require(`joi`);
const {
  CategorySchema,
  CATEGORY_SCHEMA_TEXT_MIN,
  CATEGORY_SCHEMA_TEXT_MAX
} = require(`../../constans`);

module.exports = Joi.object({
  name: Joi.string().min(CATEGORY_SCHEMA_TEXT_MIN).max(CATEGORY_SCHEMA_TEXT_MAX).required().messages({
    'string.min': CategorySchema.TEXT_MIN,
    'string.max': CategorySchema.TEXT_MAX,
    'string.empty': CategorySchema.TEXT_EMPTY
  })
});
