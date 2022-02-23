'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans`);

const categoryValidator = require(`../middleware/category-validator`);
const CategorySchema = require(`../schemes/category-schema`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK).json(categories);
  });

  route.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const {count, articlesByCategory} = await service.findPage(categoryId, limit, offset);
    const category = await service.findOne(categoryId);

    res.status(HttpCode.OK).json({category, count, articlesByCategory});
  });

  route.post(`/`, categoryValidator(CategorySchema), async (req, res) => {
    const category = await service.create(req.body);
    if (!category) {
      res.status(HttpCode.BAD_REQUEST).send([{value: `ошибка`}]);
    } else {
      res.status(HttpCode.CREATED).json(category);
    }
  });

  route.put(`/:categoryId`, categoryValidator(CategorySchema), async (req, res) => {
    const {categoryId} = req.params;
    const category = req.body;

    const categoryRes = await service.update({categoryId, category});
    if (!category) {
      res.status(HttpCode.BAD_REQUEST).send([{value: `ошибка`}]);
    } else {
      res.status(HttpCode.CREATED).send(categoryRes);
    }
  });

  route.delete(`/:categoryId/delete`, async (req, res) => {
    const {categoryId} = req.params;
    const deletedStatus = await service.drop({id: categoryId});
    if (!deletedStatus) {
      return res.status(HttpCode.FORBIDDEN).send([{value: `ошибка`}]);
    }

    return res.status(HttpCode.DELETED).send(deletedStatus);
  });

};

