import boom from '@hapi/boom'
import { isCelebrate } from 'celebrate'
import logger from './winston'

module.exports = (app) => {
  // Error Middleware
  app.use(async (err, req, res, next) => {
    let error = null

    // Check if Validation Error
    if (isCelebrate(err)) {
      error = boom.badData(err.joi.name)
      error.message = err.joi.message
      error.output.payload.name = err.joi.name
      error.output.payload.message = err.joi.message
      error.output.payload.data = err.joi.details
    } else if (err.message === 'client-timeout') {
      error = boom.clientTimeout('Client Timeout')
    } else if (err.message === 'validation-error') {
      error = boom.badData('Validation error')
    } else if (err.message === 'not-found') {
      error = boom.notFound('Not found')
    } else if (err.message === 'client-authentication') {
      error = boom.unauthorized('Client Authentication failed')
    } else {
      error = boom.notFound()
    }

    // add this line to include winston logging
    logger.error(
      `${error.output.statusCode || 500} - ${error.message} - ${
        req.originalUrl
      } - ${req.method} - ${req.ip}`
    )

    await res.status(error.output.statusCode).json(error.output.payload)
  })
}
