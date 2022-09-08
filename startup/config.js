const startupDebugger = require('debug')('app:startup')
require('../lib/dotenv')()

module.exports = function () {
  startupDebugger('application Name: ' + process.env.APPNAME)

  if (!process.env.JWTPRIVATEKEY)
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.')
}
