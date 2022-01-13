'use strict';

const {Router} = require(`express`);
const articleValidator = require(`../middleware/article-validator`);
const commentValidator = require(`../middleware/comment-validator`);
const routeValidator = require(`../middleware/route-param-validator.js`);
const articleExist = require(`../middleware/article-exist`);

const ArticleSchema = require(`../schemes/article-schema`);
const CommentSchema = require(`../schemes/comment-schema`);
const RouteSchema = require(`../schemes/route-params-schema`);
const {HttpCode} = require(`../../constans`);


module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    let result;

    if (limit || offset) {
      result = await articleService.findPage({limit, offset, comments});
    } else {
      result = await articleService.findAll(comments);
    }

    if (!result) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/:articleId`, routeValidator(RouteSchema), async (req, res) => {
    const {articleId} = req.params;

    try {
      const article = await articleService.findOne(articleId);
      return res.status(HttpCode.OK).json(article);
    } catch (e) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {

    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    if (!comments) {
      return res.status(HttpCode.NOT_FOUND).send(`No comments`);
    }

    return res.status(HttpCode.OK).json(comments);
  });

  route.post(`/:articleId/comments`, [routeValidator(RouteSchema), articleExist(articleService), commentValidator(CommentSchema)], async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED).json(comment);

  });

  route.post(`/`, articleValidator(ArticleSchema), async (req, res) => {

    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, [routeValidator(RouteSchema), articleExist(articleService), articleValidator(ArticleSchema)], async (req, res) => {
    const {articleId} = req.params;
    const updateRes = await articleService.update(articleId, req.body);

    if (!updateRes) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).send(updateRes);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    const deletedStatus = articleService.drop(articleId);

    if (!deletedStatus) {
      return res.status(HttpCode.FORBIDDEN).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.DELETED).send(deletedStatus);
  });

  route.delete(`/:articleId/comments/:commentId`, async (req, res) => {
    const {commentId} = req.params;

    const deletedRes = await commentService.drop(commentId);

    if (!deletedRes) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${commentId}`);
    }

    return res.status(HttpCode.DELETED).send(deletedRes);
  });
};
