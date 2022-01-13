'use strict';
const express = require(`express`);
const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const pictureUpload = require(`../middleware/picture-upload`);
const {HttpCode} = require(`../../constans`);

const articlesRouter = new Router();
const api = getAPI();

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};

articlesRouter.use(express.urlencoded({extended: true}));

articlesRouter.get(`/add`, (req, res) => {
  res.render(`articles/post-new`, {articleData: {}});
});

articlesRouter.post(`/add`, pictureUpload.single(`img`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    title: body.title,
    date: body.date,
    categories: [1],
    announce: body.announce,
    picture: file ? file.filename : ``,
    fullText: body.fullText
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    const validationMessage = e.response.data;
    res.render(`articles/post-new`, {articleData, validationMessage});
  }
});

articlesRouter.post(`/edit/:id`, pictureUpload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const article = {
    title: body.title,
    date: body.date,
    categories: [1],
    announce: body.announce,
    picture: file ? file.filename : ``,
    fullText: body.fullText
  };

  try {
    await api.editArticle(id, article);
    res.redirect(`/my`);
  } catch (e) {
    const validationMessage = e.response.data;
    const [oldArticle] = await getEditArticleData(id);
    res.render(`/articles/post-edit`, {id, oldArticle, validationMessage});
  }
});

articlesRouter.post(`/:id`, async (req, res) => {

  const {message} = req.body;
  const {id} = req.params;

  try {
    await api.createComment(id, {text: message});
    res.redirect(`/articles/${id}`);
  } catch (e) {
    const validationMessage = e.response.data;
    const article = await api.getArticle(id, true);
    res.render(`articles/post-detail`, {id, article, validationMessage});
  }

});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const article = await api.getArticle(id);
    res.render(`articles/post-edit`, {article});
  } catch (e) {
    res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }

});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;
  const {categories} = await api.getArticle(id, true);
  res.render(`articles/articles-by-category`, {categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const article = await api.getArticle(id, true);
    res.render(`articles/post-detail`, {article});
  } catch (e) {
    res.render(`errors/404`);
  }

});

module.exports = articlesRouter;
