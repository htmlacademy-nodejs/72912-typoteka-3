'use strict';

const category = require(`./category`);
const articles = require(`./articles`);
const search = require(`./search`);
const user = require(`./user`);
const {Router} = require(`express`);

const {CategoryService, ArticleService, CommentService, SearchService, UserService} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const app = new Router();

(async () => {
  defineModels(sequelize);

  category(app, new CategoryService(sequelize));
  articles(app, new ArticleService(sequelize), new CommentService(sequelize));
  search(app, new SearchService(sequelize));
  user(app, new UserService(sequelize));
})();

module.exports = app;
