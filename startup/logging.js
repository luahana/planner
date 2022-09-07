const winston = require('winston')
const config = require('config')
require('winston-mongodb')
require('express-async-errors')

module.exports = function (db) {
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
      filename: config.get('logFile'),
      handleRejections: true,
      handleExceptions: true,
      level: 'error',
    })
  )

  winston.add(
    new winston.transports.MongoDB({
      db: db,
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
