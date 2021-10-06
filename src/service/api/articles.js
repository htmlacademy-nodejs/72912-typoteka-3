'use strict';

const {Router} = require(`express`);
const articleValidator = require(`../middleware/article-validator`);
const commentValidator = require(`../middleware/comment-validator`);
const articleExist = require(`../middleware/article-exist`);

const {HttpCode} = require(`../../constans`);


const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    if (!articles) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article.id);

    if (!comments) {
      return res.status(HttpCode.NOT_FOUND).send(`No comments`);
    }

    return res.status(HttpCode.OK).json(comments);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.update(articleId, req.body);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).send(`update`);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    const deletedArticle = articleService.drop(articleId);

    if (!deletedArticle) {
      return res.status(HttpCode.FORBIDDEN).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.DELETED).send(`deleted`);
  });

  route.delete(`/:articleId/comments/:commentId`, (req, res) => {
    const {articleId, commentId} = req.params;
    const comment = commentService.findOne(articleId, commentId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`No comment`);
    }

    const deletedComment = commentService.drop(articleId, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.FORBIDDEN).send(`Not found with ${commentId}`);
    }

    return res.status(HttpCode.DELETED).send(`deleted`);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const {articleId} = req.params;
    const comment = commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED).json(comment);

  });

};
