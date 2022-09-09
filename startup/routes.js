const error = require('../middleware/error')
const users = require('../routes/users')
const index = require('../routes/index')
const auth = require('../routes/auth')

module.exports = function (app) {
  app.use('/api/', index)
  app.use('/api/users', users)
  app.use('/api/auth', auth)

  app.use(error)
}
