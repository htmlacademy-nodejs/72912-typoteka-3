'use strict';

const {HttpCode, UserSchema} = require(`../../constans`);

module.exports = (service) => async (req, res, next) => {
  try {
    const userByEmail = await service.findByEmail(req.body.email);
    if (userByEmail) {
      return res.status(HttpCode.BAD_REQUEST).send([{value: UserSchema.EMAIL_EXISTS}]);
    }
  } catch(e) {
    return e.details;
  }

  return next();

};
