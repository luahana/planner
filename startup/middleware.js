const environment = require('../env.js')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('../middleware/cors')
const startupDebugger = require('debug')('app:startup')

module.exports = function (app) {
  if (process.env.NODE_ENV !== environment.prod) {
    app.use(morgan('tiny'))
    startupDebugger('Morgan enabled...')
  }
  app.use(cors(corsOptions))
  app.use(cookieParser())
}
