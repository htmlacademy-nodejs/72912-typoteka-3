'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans`);

module.exports = (app, searchService) => {
  const route = new Router();
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query} = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
    }

    const searchResult = searchService.findAll(query.toLowerCase());
    if (!searchResult) {
      return res.status(HttpCode.NOT_FOUND).send(`Not Found`);
    }

    return res.status(HttpCode.OK).json(searchResult);
  });
};
