'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const auth = require(`../middleware/auth`);
const myRouter = new Router();
const api = getAPI();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: false});
  res.render(`my`, {articles, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  res.render(`comments`, {articles: articles.slice(0, 3), user});
});

module.exports = myRouter;
