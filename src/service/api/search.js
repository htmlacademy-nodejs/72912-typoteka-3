'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans`);

const route = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query} = req.query;

    const searchResult = searchService.findAll(query.toLowerCase());
    if (!searchResult) {
      return res.status(HttpCode.NOT_FOUND).send(`Not Found`);
    }

    return res.status(HttpCode.OK).json(searchResult);
  });
};
