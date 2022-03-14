'use strict';

const {Router} = require(`express`);

const {
  category,
  articles,
  search,
  user
} = require(`../api`);

const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
  UserService
} = require(`../data-service`);

const sequelize = require(`./sequelize`);
const defineModels = require(`../models`);

const routes = new Router();

(async () => {
  defineModels(sequelize);

  category(routes, new CategoryService(sequelize));
  articles(routes, new ArticleService(sequelize), new CommentService(sequelize));
  search(routes, new SearchService(sequelize));
  user(routes, new UserService(sequelize));
})();

module.exports = routes;
