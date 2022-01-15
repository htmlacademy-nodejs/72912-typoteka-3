'use strict';

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineArticleCategory = require(`./article-category`);
const defineUser = require(`./user`);

const Aliase = require(`./aliase`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`
  });

  Comment.belongsTo(Article, {
    as: Aliase.ARTICLES,
    foreignKey: `articleId`
  });

  Article.belongsToMany(Category, {
    as: Aliase.CATEGORIES,
    through: ArticleCategory
  });

  Category.belongsToMany(Article, {
    as: Aliase.ARTICLES,
    through: ArticleCategory
  });

  Category.hasMany(ArticleCategory, {
    as: Aliase.ARTICLE_CATEGORIES
  });

  User.hasMany(Article, {
    as: Aliase.ARTICLES,
    foreignKey: `userId`
  });

  Article.belongsTo(User, {
    as: Aliase.USERS,
    foreignKey: `userId`
  });

  User.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `userId`
  });

  Comment.belongsTo(User, {
    as: Aliase.USERS,
    foreignKey: `userId`
  });

  return {Category, Comment, Article, ArticleCategory, User};
};

module.exports = define;
