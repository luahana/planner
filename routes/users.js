const _ = require('lodash')
const autho = require('../middleware/autho')
const validateObjectId = require('../middleware/validateObjectId')
const { User, validateUser } = require('../models/User')
const express = require('express')
const validate = require('../middleware/validate')
const router = express.Router()
const errormsg = require('../lib/errormsg')

router.get('/me', autho, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').lean()

  res.send(user)
})

router.get('/', autho, async (req, res) => {
  const users = await User.find().select('-password').lean()
  if (!users?.length)
    return res.status(404).send({ [errormsg.message]: 'No users found' })

  res.send(users)
  res.j
})

router.get('/:id', validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').lean()
  if (!user)
    return res.status(404).send({ [errormsg.message]: 'User not found' })

  res.send(user)
})

router.post('/', validate(validateUser), async (req, res) => {
  let user = await User.findOne({ email: req.body.email }).lean()
  if (user)
    return res
      .status(400)
      .send({ [errormsg.message]: 'User already registered.' })

  user = new User(_.pick(req.body, ['name', 'email', 'password', 'roles']))
  user.password = await user.generateHashedPassword(user.password)

  await user.save()

  const token = user.generateAuthToken()

  res
    .header('x-auth-token', token)
    .send(_.pick(user, ['_id', 'name', 'email', 'roles']))
})

router.put('/', validate(validateUser), async (req, res) => {
  const { id, name, password, roles } = req.body
  const user = await User.findById(id).lean()
  if (!user)
    return res.status(404).send({ [errormsg.message]: 'User not found' })

  user.name = name
  user.roles = roles
  if (password) user.password = await user.generateHashedPassword(user.password)

  const updatedUser = await user.save()

  res.send(updatedUser)
})

router.delete('/', async (req, res) => {
  const { id } = req.body

  if (!id) return res.status(400).send({ [errormsg.message]: 'id is required' })

  const user = await User.findById(id).lean()
  if (!user)
    return res.status(400).send({ [errormsg.message]: 'user not found' })
  const result = await user.deleteOne()

  res.json({
    [errormsg.message]: `User ${user.email} with id ${user._id} is deleted`,
  })
})

module.exports = router
