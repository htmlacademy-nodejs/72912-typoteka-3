'use strict';

const {Router} = require(`express`);
const {HttpCode, ErrorAuthMessage} = require(`../../constans`);

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

  route.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;

    try {
      const user = await service.findByEmail(email);

      if (!user) {
        res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
        return;
      }
      const passwordIsCorrect = await passwordUtils.compare(password, user.passwordHash);

      if (passwordIsCorrect) {
        delete user.passwordHash;
        res.status(HttpCode.OK).json(user);
      } else {
        res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.PASSWORD);
      }

    } catch (e) {
      res.status(HttpCode.FORBIDDEN).send(`Ошибка: ${e.message}`);
    }

  });
};
