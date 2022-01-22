'use strict';
const express = require(`express`);
const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const pictureUpload = require(`../middleware/picture-upload`);
const auth = require(`../middleware/auth`);
const {HttpCode} = require(`../../constans`);
const csrf = require(`csurf`);
const csrfProtection = csrf();

const articlesRouter = new Router();
const api = getAPI();

articlesRouter.use(express.urlencoded({extended: true}));

articlesRouter.get(`/add`, [auth, csrfProtection], (req, res) => {
  const {user} = req.session;
  res.render(`articles/post-new`, {articleData: {}, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/add`, [auth, pictureUpload.single(`img`), csrfProtection], async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;

  const articleData = {
    title: body.title,
    date: body.date,
    categories: [1],
    announce: body.announce,
    picture: file ? file.filename : ``,
    fullText: body.fullText
  };

  try {
    await api.createArticle({...articleData, userId: user.id});
    res.redirect(`/my`);
  } catch (e) {
    const validationMessage = e.response.data;
    res.render(`articles/post-new`, {articleData, validationMessage, csrfToken: req.csrfToken()});
  }
});

articlesRouter.post(`/edit/:id`, [auth, pictureUpload.single(`upload`), csrfProtection], async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const {user} = req.session;

  const article = {
    title: body.title,
    date: body.date,
    categories: [1],
    announce: body.announce,
    picture: file ? file.filename : ``,
    fullText: body.fullText
  };

  try {
    await api.editArticle(id, {...article, userId: user.id});
    res.redirect(`/my`);
  } catch (e) {
    const validationMessage = e.response.data;
    res.render(`articles/post-edit`, {id, article, validationMessage, user, csrfToken: req.csrfToken()});
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

articlesRouter.get(`/edit/:id`, [auth, csrfProtection], async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  try {
    const article = await api.getArticle(id);
    res.render(`articles/post-edit`, {id, article, user, csrfToken: req.csrfToken()});
  } catch (e) {
    res.status(HttpCode.NOT_FOUND).render(`errors/404`, {user});
  }

});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const {categories} = await api.getArticle(id, true);
  res.render(`articles/articles-by-category`, {categories, user});
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  try {
    const article = await api.getArticle(id, true);
    res.render(`articles/post-detail`, {article, user, csrfToken: req.csrfToken()});
  } catch (e) {
    res.render(`errors/404`, {user});
  }

});

module.exports = articlesRouter;
