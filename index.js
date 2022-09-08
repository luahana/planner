const startupDebugger = require('debug')('app:startup')
const config = require('config')
const environment = require('./env.js')
const express = require('express')
const app = express()

let db = config.get('db')
if (process.env.NODE_ENV === environment.prod) db = config.get('db_prod')
if (process.env.NODE_ENV === environment.dev) db = config.get('db_dev')

require('./startup/logging')(db)
require('./startup/config')()
require('./startup/middleware')(app)
require('./startup/routes')(app)
require('./startup/db')(db)
// require('./startup/validation')()
if (process.env.NODE_ENV === environment.prod) {
  require('./startup/prod')(app)
}

const port = process.env.PORT || 8080
if (process.env.NODE_ENV !== environment.test) {
  app.listen(port, () => startupDebugger(`Listening on port ${port}...`))
}

module.exports = app
