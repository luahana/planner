const express = require('express')
const environment = require('../lib/env.js')
const startupDebugger = require('debug')('app:startup')
const corsOptions = require('../middleware/cors')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

module.exports = function (app) {
  if (process.env.NODE_ENV !== environment.prod) {
    app.use(morgan('tiny'))
    startupDebugger('Morgan enabled...')
  }
  app.use(cors(corsOptions))
  app.use(cookieParser())
  app.use(express.json())
}
