const dbDebugger = require('debug')('app:db')
const mongoose = require('mongoose')

module.exports = async function (db) {
  const connections = await mongoose.connect(db)
  const { host, port, name } = connections.connections[0]
  dbDebugger(`Connected to ${host}:${port} ${name}`)
}
