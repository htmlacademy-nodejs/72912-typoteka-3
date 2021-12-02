'use strict';

const {Model} = require(`sequelize`);
const Aliase = require(`./aliase`);

class ArticleCategory extends Model {}

const define = (sequelize) => ArticleCategory.init({}, {
  sequelize,
  tableName: Aliase.ARTICLE_CATEGORIES
});

module.exports = define;
