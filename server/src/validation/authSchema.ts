import Joi from 'joi';

export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
  }),
  firstname: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Firstname can only contain letters and numbers',
    'string.min': 'Firstname must be at least 3 characters long',
  }),
   lastname: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Lastname can only contain letters and numbers',
    'string.min': 'Lastname must be at least 3 characters long',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  })
});