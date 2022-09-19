const dbDebugger = require('debug')('app:db')
const mongoose = require('mongoose')
require('../lib/dotenv')()

module.exports = async function () {
  const connections = await mongoose.connect(process.env.DB)
  const { host, port, name } = connections.connections[0]
  dbDebugger(`Connected to ${host}:${port} ${name}`)
}

// const csv = require('csvtojson')
// const csvFilePath = 'C:\\Users\\truep\\Documents\\project\\22_calendar.csv'
// const { Calendar } = require('../models/Calendar')
// const dbDebugger = require('debug')('app:db')
// const mongoose = require('mongoose')
// require('../lib/dotenv')()

// module.exports = async function () {
//   const connections = await mongoose.connect(process.env.DB)
//   const { host, port, name } = connections.connections[0]
//   dbDebugger(`Connected to ${host}:${port} ${name}`)

//   const jsonArray = await csv().fromFile(csvFilePath)
//   console.log(jsonArray)

//   const arr = []
//   for (let i = 0; i < jsonArray.length; i++) {
//     let cal = new Calendar({
//       year: parseInt(jsonArray[i].year),
//       quarter: parseInt(jsonArray[i].quarter),
//       month: parseInt(jsonArray[i].month),
//       day: parseInt(jsonArray[i].day),
//       week: parseInt(jsonArray[i].week),
//       weekday: parseInt(jsonArray[i].weekday),
//     })
//     arr.push(cal)
//   }
//   Calendar.insertMany(arr, (err, data) => {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log('uploaded')
//     }
//   })
// }
