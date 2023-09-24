import Joi, { ObjectSchema } from 'joi';

export const signinSchema: ObjectSchema = Joi.object()
  .keys({
    email: Joi.string().email().messages({
      'string.base': 'Email must be of type string',
      'string.email': 'Email must be valid'
    }),
    password: Joi.string().required().min(4).max(32).messages({
      'string.base': 'Password must contains numbers and characters',
      'string.min': 'Password must be greater than 4 characters',
      'string.max': 'Password must be less than 32 characters',
      'string.empty': 'Password is a required field'
    })
  })
