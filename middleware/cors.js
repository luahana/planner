const whitelist = ['http://localhost:3000']

module.exports = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not alllowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}
