const _ = require('lodash')
const auth = require('../middleware/auth')
const validateObjectId = require('../middleware/validateObjectId')
const { User, validateUser } = require('../models/user')
const bcrypt = require('bcrypt')
const express = require('express')
const validate = require('../middleware/validate')
const router = express.Router()

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')

  res.send(user)
})

router.get('/', auth, async (req, res) => {
  const users = await User.find()

  res.send(users)
})

router.get('/:id', validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) return res.status(404).send('User not found')

  res.send(user)
})

router.post('/', validate(validateUser), async (req, res) => {
  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send('User already registered.')

  user = new User(_.pick(req.body, ['name', 'email', 'password']))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  await user.save()

  const token = user.generateAuthToken()
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
})

module.exports = router
