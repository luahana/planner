const error = require('../middleware/error')
// const courses = require('../routes/courses')
const users = require('../routes/users')
const index = require('../routes/index')
const auth = require('../routes/auth')

module.exports = function (app) {
  app.use('/', index)
  // app.use('/api/courses', courses)
  app.use('/api/users', users)
  app.use('/api/auth', auth)

  app.use(error)
}
