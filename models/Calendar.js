const Joi = require('joi')
require('../lib/dotenv')()
const mongoose = require('mongoose')

const calendarSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  quarter: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  week: {
    type: Number,
    required: true,
  },
  weekday: {
    type: Number,
    required: true,
  },
})

const Calendar = mongoose.model('Calendar', calendarSchema)

const validateCalendar = function (calendar) {
  const schema = Joi.object({
    year: Joi.number().required(),
    quarter: Joi.number().required(),
    month: Joi.number().required(),
    day: Joi.number().required(),
    week: Joi.number().required(),
    weekday: Joi.number().required(),
  })
  return schema.validate(calendar)
}

exports.calendarSchema = calendarSchema
exports.Calendar = Calendar
exports.validateCalendar = validateCalendar
