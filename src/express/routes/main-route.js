'use strict';
const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const pictureUpload = require(`../middleware/picture-upload`);
const privateRoute = require(`../middleware/private-route`);
const {ARTICLES_PER_PAGE} = require(`../../constans`);

const mainRouter = new Router();
const api = getAPI();
const csrf = require(`csurf`);
const csrfProtection = csrf();

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;

  const offset = (page - 1) * limit;

  const [{count, articles, articlesTop, lastComments}, categories] = await Promise.all([
    api.getArticles({limit, offset, comments: true, topArticles: true, lastComments: true}),
    api.getCategories({count: true})
  ]);

  const totalPages = Math.ceil(count / limit);

  if (articles.length === 0) {
    res.render(`main-empty`, {user});
  } else {
    res.render(`main`, {articles, categories, totalPages, page, user, articlesTop, lastComments});
  }

});

mainRouter.get(`/register`, csrfProtection, (req, res) => {
  const {user} = req.session;
  res.render(`sign-up`, {user, csrfToken: req.csrfToken()});
});

mainRouter.get(`/login`, csrfProtection, (req, res) => {
  const {user} = req.session;
  res.render(`login`, {user, csrfToken: req.csrfToken()});
});

mainRouter.get(`/search`, async (req, res) => {
  const {query: searchValue} = req.query;
  const {user} = req.session;

  try {
    const articles = await api.search(searchValue);
    res.render(`search`, {articles, user, searchValue});
  } catch (e) {
    res.render(`search`, {articles: [], user, searchValue});
  }
});

mainRouter.get(`/category`, [privateRoute, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`all-categories`, {user, categories, csrfToken: req.csrfToken()});
});

mainRouter.post(`/register`, [pictureUpload.single(`img`), csrfProtection], async (req, res) => {
  const {body, file} = req;

  const userData = {
    avatar: file ? file.filename : ``,
    name: body[`name`],
    surname: body[`surname`],
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`password-repeated`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (e) {
    const validationMessage = e.response.data;
    res.render(`sign-up`, {userData, validationMessage, csrfToken: req.csrfToken()});
  }
});

mainRouter.post(`/login`, csrfProtection, async (req, res) => {
  try {
    const user = await api.auth(req.body[`user-email`], req.body[`user-password`]);

    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (e) {
    const validationMessage = e.response.data;
    res.render(`login`, {validationMessage, csrfToken: req.csrfToken()});
  }
});

mainRouter.post(`/category`, csrfProtection, async (req, res) => {
  const body = req.body;

  try {
    await api.addCategory({name: body[`add-category`]});
    res.redirect(`/category`);
  } catch (e) {
    const validationMessage = e.response.data;
    const categories = await api.getCategories();
    res.render(`all-categories`, {validationMessage, categories, csrfToken: req.csrfToken()});
  }

});

mainRouter.post(`/category/:categoryId`, csrfProtection, async (req, res) => {
  const body = req.body;
  const {categoryId} = req.params;
  try {
    await api.editCategory({name: body[`category-name`], id: categoryId});
    res.redirect(`/category`);
  } catch (e) {
    const validationMessage = e.response.data;
    const categories = await api.getCategories();
    res.render(`all-categories`, {validationMessage, categories, csrfToken: req.csrfToken()});
  }
});

mainRouter.post(`/category/:categoryId/delete`, csrfProtection, async (req, res) => {
  const {categoryId} = req.params;

  try {
    await api.deleteCategory({categoryId});
    res.redirect(`/category`);
  } catch (e) {
    const validationMessage = e.response.data;
    const categories = await api.getCategories();
    res.render(`all-categories`, {validationMessage, categories, csrfToken: req.csrfToken()});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/login`);
});

module.exports = mainRouter;
