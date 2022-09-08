const winston = require('winston')
require('../config/dotenv')()
require('winston-mongodb')
require('express-async-errors')

module.exports = function () {
  winston.add(
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  )

  winston.add(
    new winston.transports.File({
      filename: process.env.LOGFILE,
      handleRejections: true,
      handleExceptions: true,
      level: 'error',
    })
  )

  winston.add(
    new winston.transports.MongoDB({
      db: process.env.DB,
      options: {
        useUnifiedTopology: true,
      },
      format: winston.format.metadata(),
      level: 'error',
      handleRejections: true,
      handleExceptions: true,
    })
  )
}
