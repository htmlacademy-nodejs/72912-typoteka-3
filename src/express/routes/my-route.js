'use strict';

const {Router} = require(`express`);

const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.send(`Мои публикации`));
myRouter.get(`/comments`, (req, res) => res.send(`Комментарии к публикации`));

module.exports = myRouter;
