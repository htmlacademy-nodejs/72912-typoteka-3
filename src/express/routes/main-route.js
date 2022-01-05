'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {ARTICLES_PER_PAGE} = require(`../../constans`);

const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;

  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories()
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {articles, categories, totalPages, page});
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
