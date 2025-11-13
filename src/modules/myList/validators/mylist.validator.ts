import Joi from 'joi';

export const addToMyListSchema = Joi.object({
    user: Joi.string().required().messages({
        'string.empty': 'User ID is required',
        'any.required': 'User ID is required',
    }),
    contentId: Joi.string().required().messages({
        'string.empty': 'Content ID is required',
        'any.required': 'Content ID is required',
    }),
    contentType: Joi.string()
        .valid('movie', 'tvshow')
        .required()
        .messages({
            'any.only': 'Content type must be either "movie" or "tvshow"',
            'any.required': 'Content type is required',
        }),
});

export const removeFromMyListSchema = Joi.object({
    user: Joi.string().required().messages({
        'string.empty': 'User ID is required',
        'any.required': 'User ID is required',
    }),
    contentId: Joi.string().required().messages({
        'string.empty': 'Content ID is required',
        'any.required': 'Content ID is required',
    }),
});

