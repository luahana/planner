const Joi = require('joi')
const jwt = require('jsonwebtoken')
require('../config/dotenv')()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
})

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWTPRIVATEKEY
  )
}

userSchema.methods.generateHashedPassword = async function (password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

const User = mongoose.model('User', userSchema)

// use npm i joi-password-complexity for password complexity
const validateUser = function (user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(555).required().email(),
    password: Joi.string().min(5).max(255).required(),
  })
  return schema.validate(user)
}

exports.userSchema = userSchema
exports.User = User
exports.validateUser = validateUser
