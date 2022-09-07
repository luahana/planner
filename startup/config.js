const startupDebugger = require('debug')('app:startup')
const cors = require('cors')
const config = require('config')
const morgan = require('morgan')

module.exports = function (app) {
  startupDebugger('application Name: ' + config.get('name'))
  app.use(cors())

  if (!config.get('jwtPrivateKey'))
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.')

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('tiny'))
    startupDebugger('Morgan enabled...')
  }
}
