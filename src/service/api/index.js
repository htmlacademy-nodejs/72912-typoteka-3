'use strict';

const category = require(`./category`);
const articles = require(`./articles`);
const search = require(`./search`);
const {Router} = require(`express`);

const {CategoryService, ArticleService, CommentService, SearchService} = require(`../data-service`);

const getMockData = require(`../lib/get-mock-data`);

const app = new Router();


(async () => {
  let mockData = await getMockData();

  category(app, new CategoryService(mockData));
  articles(app, new ArticleService(mockData), new CommentService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
