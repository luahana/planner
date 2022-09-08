const config = require('config')

module.exports = {
  origin: (origin, callback) => {
    if (config.get('allowedOrigins').indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not alllowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}
