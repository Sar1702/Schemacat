import Joi from 'joi';

export const connectDbSchema = Joi.object({
  mongoUri: Joi.string().required().messages({
    'any.required': 'MongoDB URI is required',
    'string.empty': 'MongoDB URI cannot be empty',
  }),
  dbName: Joi.string().required().messages({
    'any.required': 'Database name is required',
    'string.empty': 'Database name cannot be empty',
  }),
});
