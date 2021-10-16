'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories()
  ]);

  res.render(`main`, {articles, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  const {query: searchValue} = req.query;

  try {
    const articles = await api.search(searchValue);
    res.render(`search`, {articles, searchValue});
  } catch (e) {
    res.render(`search`, {articles: []});
  }
});

mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
