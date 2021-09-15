'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.send(`Главная страница`));
mainRouter.get(`/register`, (req, res) => res.send(`регистрация`));
mainRouter.get(`/login`, (req, res) => res.send(`вход`));
mainRouter.get(`/search`, (req, res) => res.send(`поиск`));
mainRouter.get(`/categories`, (req, res) => res.send(`категории`));

module.exports = mainRouter;
