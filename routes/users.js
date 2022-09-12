const _ = require('lodash')
const verifyJWT = require('../middleware/verifyJWT')
const validateObjectId = require('../middleware/validateObjectId')
const { User, validateUser } = require('../models/User')
const express = require('express')
const validate = require('../middleware/validate')
const router = express.Router()
const errormsg = require('../lib/errormsg')

router.get('/me', verifyJWT, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').lean()

  res.send(user)
})

router.get('/', verifyJWT, async (req, res) => {
  const { isAdmin } = req.user
  // console.log(req)
  if (isAdmin !== true) {
    return res.status(401).send({ [errormsg.message]: 'Unauthorized' })
  }
  const users = await User.find().select('-password').lean()
  if (!users?.length)
    return res.status(404).send({ [errormsg.message]: 'No users found' })

  res.send(users)
})

router.get('/:id', validateObjectId, verifyJWT, async (req, res) => {
  const { isAdmin } = req.user

  if (isAdmin !== true) {
    return res.status(401).send({ [errormsg.message]: 'Unauthorized' })
  }

  const user = await User.findById(req.params.id).select('-password').lean()
  if (!user)
    return res.status(404).send({ [errormsg.message]: 'User not found' })

  res.send(user)
})

router.post('/', validate(validateUser), async (req, res) => {
  let user = await User.findOne({ email: req.body.email })
    .collation({ locale: 'en', strength: 2 })
    .lean()

  if (user)
    return res
      .status(400)
      .send({ [errormsg.message]: 'User already registered.' })

  user = new User(
    _.pick(req.body, ['name', 'email', 'password', 'roles', 'isAdmin'])
  )
  user.password = await user.generateHashedPassword(user.password)

  await user.save()

  const token = user.generateAuthToken(process.env.ACCESS_TOKEN_SECRET)

  res
    .header('Authorization', `bearer ${token}`)
    .send(_.pick(user, ['_id', 'name', 'email', 'roles', 'isAdmin']))
})

router.put('/:id', validate(validateUser), async (req, res) => {
  const { name, password, roles } = req.body
  const user = await User.findById(req.params.id).lean()
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
  await user.deleteOne()

  res.json({
    [errormsg.message]: `User ${user.email} with id ${user._id} is deleted`,
  })
})

module.exports = router
