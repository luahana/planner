const environment = require('../lib/env.js')
let whitelist = ['https://www.simpletodo.org', 'https://simpletodo.org']
if (
  process.env.NODE_ENV === environment.dev ||
  process.env.NODE_ENV === environment.test
) {
  whitelist = ['http://localhost:3000']
}

module.exports = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not alllowed by CORS'))
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
}
