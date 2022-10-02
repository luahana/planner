const environment = require('../lib/env.js')
let whitelist
if (
  process.env.NODE_ENV === environment.dev ||
  process.env.NODE_ENV === environment.test
) {
  whitelist = ['http://localhost:3000']
} else {
  whitelist = ['https://planner-frontend-nsk7.vercel.app']
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
  optionsSuccessStatus: 200,
}
