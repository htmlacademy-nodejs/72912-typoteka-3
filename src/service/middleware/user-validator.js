'use strict';

const {HttpCode} = require(`../../constans`);

module.exports = (schema) => async (req, res, next) => {
  const newUser = req.body;

  try {
    await schema.validateAsync(newUser, {abortEarly: false});
  } catch (e) {
    const {details} = e;

    const listErrors = details.map(({message, context}) => {
      const error = {
        type: context.label,
        value: message
      };
      return error;
    });

    return res.status(HttpCode.BAD_REQUEST).send(listErrors);
  }

  return next();

};
