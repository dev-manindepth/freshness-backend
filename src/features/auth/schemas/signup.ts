import Joi, { ObjectSchema } from 'joi';

export const addressSchema: ObjectSchema = Joi.object().keys({
  street: Joi.string().messages({
    'string.base': 'street must be string'
  }),
  city: Joi.string().required().messages({
    'string.base': 'City name must be string',
    'string.empty': 'City name is required'
  }),
  state: Joi.string().required().messages({
    'string.base': 'State name must be string',
    'string.empty': 'State name is required'
  }),
  zipCode: Joi.number().required().messages({
    'string.base': 'zipcode  must be string',
    'string.empty': 'zipcode  is required'
  }),
  country: Joi.string().required().messages({
    'string.base': 'Country name must be string',
    'string.empty': 'Country name is required'
  })
});
export const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(40).messages({
    'string.base': 'Username must be of type string',
    'string.min': 'Invalid username',
    'string.max': 'Invalid username',
    'string.empty': 'Username is required field'
  }),
  password: Joi.string().required().min(4).max(32).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Password must be greater than 4 characters',
    'string.max': 'Password must be less than 32 characters',
    'string.empty': 'Password is required field'
  }),
  email: Joi.string().required().email().messages({
    'string.base': 'email must be of type string',
    'string.email': 'email must be valid',
    'string.empty': 'email is  a required field'
  }),
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must have 10 digits.',
      'string.empty': 'Phone number is required'
    })
});
