'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constans`);

const userValidator = require(`../middleware/user-validator`);
const userExists = require(`../middleware/user-exists`);

const UserSchema = require(`../schemes/user-schema`);

const passwordUtils = require(`../lib/password`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/user`, route);

  route.post(`/`, [userValidator(UserSchema), userExists(service)], async (req, res) => {
    const data = req.body;

    try {
      data.passwordHash = await passwordUtils.hash(data.password);
      const result = await service.create(data);

      delete result.passwordHash;

      res.status(HttpCode.CREATED).json(result);
    } catch (e) {
      res.status(HttpCode.FORBIDDEN).send(e);
    }

  });
};
