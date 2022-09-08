const startupDebugger = require('debug')('app:startup')
const config = require('config')

module.exports = function () {
  startupDebugger('application Name: ' + config.get('name'))

  if (!config.get('jwtPrivateKey'))
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.')
}
