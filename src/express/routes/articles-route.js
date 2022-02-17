'use strict';
const express = require(`express`);
const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const pictureUpload = require(`../middleware/picture-upload`);
const auth = require(`../middleware/auth`);
const privateRoute = require(`../middleware/private-route`);
const {ARTICLES_PER_PAGE} = require(`../../constans`);
const {convertDate, getCategories} = require(`../../utils`);
const csrf = require(`csurf`);
const csrfProtection = csrf();

const articlesRouter = new Router();
const api = getAPI();

articlesRouter.use(express.urlencoded({extended: true}));

articlesRouter.get(`/add`, [privateRoute, csrfProtection], async (req, res) => {
  const {user} = req.session;

  const categories = await api.getCategories();
  res.render(`articles/post-new`, {article: {createdAt: convertDate(Date.now(), true)}, user, categories, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/add`, [privateRoute, pictureUpload.single(`img`), csrfProtection], async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;

  const article = {
    title: body.title,
    date: body.date,
    categories: getCategories(body.category),
    announce: body.announce,
    picture: file ? file.filename : ``,
    fullText: body.fullText
  };

  try {
    await api.createArticle({...article, userId: user.id});
    res.redirect(`/my`);
  } catch (e) {
    const validationMessage = e.response.data;
    const categories = await api.getCategories();

    res.render(`articles/post-new`, {article, validationMessage, categories, user, csrfToken: req.csrfToken()});
  }
});

articlesRouter.post(`/edit/:id`, [privateRoute, pictureUpload.single(`upload`), csrfProtection], async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const {user} = req.session;

  const article = {
    title: body.title,
    date: body.date,
    categories: getCategories(body.category),
    announce: body.announce,
    picture: file ? file.filename : ``,
    fullText: body.fullText,
    userId: user.id
  };

  try {
    await api.editArticle(id, {...article, userId: user.id});
    res.redirect(`/my`);
  } catch (e) {
    const validationMessage = e.response.data;
    const categories = await api.getCategories();
    res.render(`articles/post-edit`, {id, article, categories, validationMessage, user, csrfToken: req.csrfToken()});
  }
});

articlesRouter.post(`/:id`, [auth, csrfProtection], async (req, res) => {

  const {message} = req.body;
  const {id} = req.params;
  const {user} = req.session;

  try {
    await api.createComment(id, {userId: user.id, text: message});
    res.redirect(`/articles/${id}`);
  } catch (e) {
    const validationMessage = e.response.data;
    const article = await api.getArticle(id, true);
    res.render(`articles/post-detail`, {id, article, user, validationMessage, csrfToken: req.csrfToken()});
  }

});

articlesRouter.get(`/edit/:id`, [privateRoute, csrfProtection], async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;

  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);

  res.render(`articles/post-edit`, {id, article: {...article, categories: article.categories.map((category) => category.id)}, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.get(`/category/:categoryId`, async (req, res) => {
  const {categoryId} = req.params;
  const {user} = req.session;

  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;

  const offset = (page - 1) * limit;

  const [{count, articlesByCategory: articles, category}, categories] = await Promise.all([
    api.getCategory({categoryId, limit, offset}),
    api.getCategories({count: true})
  ]);


  const totalPages = Math.ceil(count / limit);

  res.render(`articles/articles-by-category`, {categoryId, articles, categories, category, totalPages, page, user});
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;


  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories({count: true})
  ]);

  const filtredCategories = categories.filter((it) => {
    return article.categories.some((it2) => it2.id === it.id);
  });

  res.render(`articles/post-detail`, {article, user, filtredCategories, csrfToken: req.csrfToken()});

});

module.exports = articlesRouter;
