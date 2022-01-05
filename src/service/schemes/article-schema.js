'use strict';

const Joi = require(`joi`);
const {ArticleSchema} = require(`../../constans`);

module.exports = Joi.object({
  categories: Joi.array().items(Joi.number().positive().messages({
    'string.base': ArticleSchema.CATEGORIES
  })).min(1).required().messages({
    'array.min': ArticleSchema.CATEGORIES
  }),
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ArticleSchema.TITLE_MIN,
    'string.max': ArticleSchema.TITLE_MAX
  }),
  fullText: Joi.string().allow(null, ``).max(1000).messages({
    'string.max': ArticleSchema.FULL_TEXT
  }),
  picture: Joi.string().allow(null, ``).pattern(new RegExp(`\.(?:pn|jp?)g`)).messages({
    'string.pattern': ArticleSchema.PICTURE
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ArticleSchema.ANNOUNCE_MIN,
    'string.max': ArticleSchema.ANNOUNCE_MAX,
    'string.empty': ArticleSchema.ANNOUNCE_NOT_EMPTY
  }),
  date: Joi.date().required().messages({
    'string.any': ArticleSchema.DATE
  })
});
