const startupDebugger = require('debug')('app:startup')
const environment = require('./lib/env.js')
const express = require('express')
const app = express()

require('./startup/logging')()
require('./startup/config')()
require('./startup/middleware')(app)
require('./startup/routes')(app)
require('./startup/db')()
// require('./startup/validation')()
if (process.env.NODE_ENV === environment.prod) {
  require('./startup/prod')(app)
}

const port = process.env.PORT || 8080
if (process.env.NODE_ENV !== environment.test) {
  app.listen(port, () => startupDebugger(`Listening on port ${port}...`))
}

module.exports = app
