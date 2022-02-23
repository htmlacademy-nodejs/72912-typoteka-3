'use strict';

const Joi = require(`joi`);
const {UserSchema} = require(`../../constans`);

module.exports = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': UserSchema.EMAIL,
    'any.required': UserSchema.REQUIRED_FIELD
  }),
  password: Joi.string().required().min(6).messages({
    'string.min': UserSchema.PASSWORD_MIN,
    'any.required': UserSchema.REQUIRED_FIELD
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).messages({
    'any.only': UserSchema.PASSWORD_REPEAT,
    'any.required': UserSchema.REQUIRED_FIELD
  }),
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': UserSchema.NAME,
    'any.required': UserSchema.REQUIRED_FIELD
  }),
  surname: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': UserSchema.SURNAME,
    'string.empty': UserSchema.SURNAME_EMPTY,
    'any.required': UserSchema.REQUIRED_FIELD
  }),
  avatar: Joi.string().allow(null, ``)
});

