import { Joi } from 'celebrate'

export const getSingleSchema = Joi.object().keys({
  id: Joi.string().required(),
})

export const deleteSchema = Joi.object().keys({
  id: Joi.string().required(),
})

export const createSchema = Joi.object().keys({
  parent: Joi.number().integer().required(),
  prefix: Joi.string().default('Channel'),
  minChannel: Joi.number().integer().default(1),
  maxUsers: Joi.number().integer().required(),
  codec: Joi.number().integer().default(4),
  quality: Joi.number().integer().default(6),
  joinPower: Joi.number().integer().default(0),
  topic: Joi.string().allow(''),
  description: Joi.string().allow(''),
})

export const updateSchema = Joi.object().keys({
  id: Joi.string().required(),
  parent: Joi.number().integer().required(),
  prefix: Joi.string().default('Channel'),
  minChannel: Joi.number().integer().default(1),
  maxUsers: Joi.number().integer().required(),
  codec: Joi.number().integer().default(4),
  quality: Joi.number().integer().default(6),
  joinPower: Joi.number().integer().default(0),
  topic: Joi.string().allow(''),
  description: Joi.string().allow(''),
})
