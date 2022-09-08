const dbDebugger = require('debug')('app:db')
const mongoose = require('mongoose')
require('../config/dotenv')()

module.exports = async function () {
  const connections = await mongoose.connect(process.env.DB)
  const { host, port, name } = connections.connections[0]
  dbDebugger(`Connected to ${host}:${port} ${name}`)
}
