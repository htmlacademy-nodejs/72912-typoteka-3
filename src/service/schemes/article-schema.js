'use strict';

const Joi = require(`joi`);
const {
  ArticleSchema,
  ARTICLE_SCHEMA_ANNOUNCE_MIN,
  ARTICLE_SCHEMA_ANNOUNCE_MAX,
  ARTICLE_SCHEMA_FULL_TEXT,
  ARTICLE_SCHEMA_TITLE_MIN,
  ARTICLE_SCHEMA_TITLE_MAX,
} = require(`../../constans`);

module.exports = Joi.object({
  categories: Joi.array().items(Joi.number().positive().messages({
    'string.base': ArticleSchema.CATEGORIES
  })).min(1).required().messages({
    'array.min': ArticleSchema.CATEGORIES
  }),
  title: Joi.string().min(ARTICLE_SCHEMA_TITLE_MIN).max(ARTICLE_SCHEMA_TITLE_MAX).required().messages({
    'string.min': ArticleSchema.TITLE_MIN,
    'string.max': ArticleSchema.TITLE_MAX
  }),
  fullText: Joi.string().allow(null, ``).max(ARTICLE_SCHEMA_FULL_TEXT).messages({
    'string.max': ArticleSchema.FULL_TEXT
  }),
  picture: Joi.string().allow(null, ``).pattern(new RegExp(`\.(?:pn|jp?)g`)).messages({
    'string.pattern': ArticleSchema.PICTURE
  }),
  announce: Joi.string().min(ARTICLE_SCHEMA_ANNOUNCE_MIN).max(ARTICLE_SCHEMA_ANNOUNCE_MAX).required().messages({
    'string.min': ArticleSchema.ANNOUNCE_MIN,
    'string.max': ArticleSchema.ANNOUNCE_MAX,
    'string.empty': ArticleSchema.ANNOUNCE_NOT_EMPTY
  }),
  date: Joi.date().required().messages({
    'string.any': ArticleSchema.DATE
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ArticleSchema.USER_ID
  })
});
