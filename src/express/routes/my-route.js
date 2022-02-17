'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const privateRoute = require(`../middleware/private-route`);
const csrf = require(`csurf`);
const csrfProtection = csrf();

const {getAndSortComments} = require(`../../utils`);

const myRouter = new Router();
const api = getAPI();


myRouter.get(`/`, [privateRoute, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: false});
  res.render(`my`, {articles, user, csrfToken: req.csrfToken()});
});

myRouter.get(`/comments`, [privateRoute, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  const comments = await getAndSortComments(articles);

  res.render(`comments`, {articles, comments, user, csrfToken: req.csrfToken()});
});

myRouter.post(`/:articleId`, [privateRoute, csrfProtection], async (req, res) => {
  const {articleId} = req.params;
  const {user} = req.session;

  try {
    await api.deleteArticle({articleId, userId: user.id});
    res.redirect(`/my`);
  } catch (e) {
    const articles = await api.getArticles({userId: user.id});
    res.render(`my`, {articles, user, csrfToken: req.csrfToken()});
  }
});

myRouter.post(`/comments/:commentId`, [privateRoute, csrfProtection], async (req, res) => {
  const {commentId} = req.params;
  const {articleId} = req.body;
  const {user} = req.session;

  try {
    await api.deleteComment({commentId, articleId, userId: user.id});
    res.redirect(`/my/comments`);
  } catch (e) {
    const articles = await api.getArticles({comments: true});
    const comments = await getAndSortComments(articles);
    res.render(`comments`, {articles, comments, user, csrfToken: req.csrfToken()});
  }
});

module.exports = myRouter;
