import Joi, { ObjectSchema } from 'joi';

export const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'email must be string',
    'string.email': 'Email must be valid'
  })
});

export const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(4).max(32).messages({
    'string.base': 'Invalid Password',
    'string.empty': 'Password is a required field',
    'string.min': 'Invalid Password',
    'string.max': 'Invalid Password'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Password and confirm Password are not same',
    'any.required': 'ConfirmPassword is required'
  })
});

export const tokenSchema: ObjectSchema = Joi.object().keys({
  token: Joi.string().required().messages({
    'string.base': 'Invalid token',
    'string.empty': 'Token is required'
  })
});
