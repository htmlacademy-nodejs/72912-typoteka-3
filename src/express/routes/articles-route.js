'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const pictureUpload = require(`../middleware/picture-upload`);

const articlesRouter = new Router();
const api = getAPI();

articlesRouter.get(`/add`, (req, res) => {
  res.render(`articles/post-new`, {articleData: {}});
});

articlesRouter.post(`/add`, pictureUpload.single(`img`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    title: body.title,
    createDate: body.date,
    category: [],
    announce: body.announce,
    picture: file ? file.filename : ``,
    fullText: body.fullText
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    res.render(`articles/post-new`, {articleData});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  res.render(`articles/post-edit`, {article});
});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;
  const {categories} = await api.getArticle(id, true);
  res.render(`articles/articles-by-category`, {categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);

  res.render(`articles/post-detail`, {article});
});

module.exports = articlesRouter;
