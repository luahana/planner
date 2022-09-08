const Joi = require('joi')
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
    text: {
      type: String,
      required: true,
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
// const validateUser = function (user) {
//   const schema = Joi.object({
//     name: Joi.string().min(5).max(50).required(),
//     email: Joi.string().min(5).max(555).required().email(),
//     password: Joi.string().min(5).max(255).required(),
//   })
//   return schema.validate(user)
// }

exports.noteSchema = noteSchema
exports.Note = Note
// exports.validateUser = validateUser
