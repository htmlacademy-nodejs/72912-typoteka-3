'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const pictureUpload = require(`../middleware/picture-upload`);
const {ARTICLES_PER_PAGE} = require(`../../constans`);

const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;

  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories()
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {articles, categories, totalPages, page, user});
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

mainRouter.post(`/register`, pictureUpload.single(`img`), async (req, res) => {
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
    console.log(`Main route ${e}`);
    const validationMessage = e.message.data;
    res.render(`sign-up`, {userData, validationMessage});
  }
});

mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body[`user-email`], req.body[`user-password`]);

    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (e) {
    const validationMessage = e.response.data;
    res.render(`login`, {validationMessage});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/login`);
});

module.exports = mainRouter;
