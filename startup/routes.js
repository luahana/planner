const express = require('express')
const error = require('../middleware/error')
// const courses = require('../routes/courses')
const users = require('../routes/users')
const index = require('../routes/index')
const auth = require('../routes/auth')
const path = require('path')

module.exports = function (app) {
  app.use(express.json())
  app.use('/', index)
  // app.use('/api/courses', courses)
  app.use('/api/users', users)
  app.use('/api/auth', auth)

  app.use(error)
}
