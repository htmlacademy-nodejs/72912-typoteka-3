'use strict';

const {Router} = require(`express`);

const articlesRouter = new Router();


articlesRouter.get(`/add`, (req, res) => res.send(`Страница создания новой публикации`));
articlesRouter.get(`/edit/:id`, (req, res) => res.send(`Редактирование публикации`));
articlesRouter.get(`/category/:id`, (req, res) => res.send(`Публикации определённой категории`));
articlesRouter.get(`/:id`, (req, res) => res.send(`Страница публикации`));

module.exports = articlesRouter;
