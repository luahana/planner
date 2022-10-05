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
    },
    content: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    assigned: {
      type: Boolean,
    },
    assignedDate: {
      type: Date,
    },
    assignedTime: {
      type: Number,
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
    title: Joi.string().optional().allow('').max(50),
    content: Joi.string().optional().allow('').max(1024),
    completed: Joi.boolean().required(),
    sets: Joi.array().items(Joi.boolean()),
    assigned: Joi.boolean(),
    assignedDate: Joi.date().allow(''),
    assignedTime: Joi.number(),
  })
  return schema.validate(note)
}

const validateNewNote = function (note) {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    title: Joi.string().optional().allow('').max(50),
    content: Joi.string().optional().allow('').max(1024),
    completed: Joi.boolean().required(),
    sets: Joi.array().items(Joi.boolean()),
    assignedDate: Joi.date().required(),
  })
  return schema.validate(note)
}

exports.noteSchema = noteSchema
exports.Note = Note
exports.validateNote = validateNote
exports.validateNewNote = validateNewNote
