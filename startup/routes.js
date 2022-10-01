const error = require('../middleware/error')
const users = require('../routes/users')
const notes = require('../routes/notes')
const index = require('../routes/index')
const auth = require('../routes/auth')

module.exports = function (app) {
  app.use('/api/', index)
  app.use('/api/users', users)
  app.use('/api/notes', notes)
  app.use('/api/auth', auth)

  app.use(error)
}
