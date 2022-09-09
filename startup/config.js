const startupDebugger = require('debug')('app:startup')
require('../lib/dotenv')()

module.exports = function () {
  startupDebugger('application Name: ' + process.env.APPNAME)

  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new Error('FATAL ERROR: ACCESS_TOKEN_SECRET is not defined.')
}
