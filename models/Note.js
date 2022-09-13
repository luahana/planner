const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
require('../lib/dotenv')()
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Note = mongoose.model('Note', noteSchema)

// use npm i joi-password-complexity for password complexity
const validateNote = function (note) {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    title: Joi.string().max(50).required(),
    content: Joi.string().max(1024),
    completed: Joi.boolean(),
  })
  return schema.validate(note)
}

exports.noteSchema = noteSchema
exports.Note = Note
exports.validateNote = validateNote
