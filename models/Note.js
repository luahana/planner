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
    assignedDate: {
      type: Date,
    },
    sets: {
      type: [Boolean],
    },
  },
  {
    timestamps: true,
  }
)

const Note = mongoose.model('Note', noteSchema)

const validateNote = function (note) {
  const schema = Joi.object({
    _id: Joi.objectId(),
    user: Joi.objectId().required(),
    title: Joi.string().max(50).required(),
    content: Joi.string().optional().allow('').max(1024),
    completed: Joi.boolean().required(),
    assignedDate: Joi.date().required(),
    sets: Joi.array().items(Joi.boolean()).optional(),
  })
  return schema.validate(note)
}

exports.noteSchema = noteSchema
exports.Note = Note
exports.validateNote = validateNote
