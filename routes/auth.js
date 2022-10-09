const _ = require('lodash')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const { User } = require('../models/User')
const express = require('express')
const router = express.Router()
const loginLimiter = require('../middleware/loginLimiter')
const { errormsg } = require('../lib/errormsg')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID)

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  })

  const payload = ticket.getPayload()
  return payload
}

router.get('/googlelogin', async (req, res) => {
  const token = req.body.googleToken
  res.send({ response: 'success' })
  return
  const payload = await verify(token)

  const email = payload.email
  const name = payload.name

  let user = await User.findOne({ email })

  if (!user) {
    user = new User({ email, name })
    await user.save()
  }

  const accessToken = user.generateAuthToken(
    process.env.ACCESS_TOKEN_SECRET,
    '15m'
  )

  const refreshToken = user.generateAuthToken(
    process.env.REFRESH_TOKEN_SECRET,
    '7d'
  )

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  res.send({ accessToken })
})

router.post('/', loginLimiter, async (req, res) => {
  const { error } = validate(req.body)
  if (error)
    return res
      .status(400)
      .send({ [errormsg.message]: error.details[0].message })

  let user = await User.findOne({ email: req.body.email })
  if (!user)
    return res
      .status(400)
      .send({ [errormsg.message]: 'Invalid email or password' })

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword)
    return res
      .status(400)
      .send({ [errormsg.message]: 'Invalid email or password' })

  const accessToken = user.generateAuthToken(
    process.env.ACCESS_TOKEN_SECRET,
    '15m'
  )

  const refreshToken = user.generateAuthToken(
    process.env.REFRESH_TOKEN_SECRET,
    '7d'
  )

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  res.send({ accessToken })
})

router.get('/refresh', (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt)
    return res
      .status(401)
      .send({ [errormsg.message]: `${cookies} Unauthorized1` })

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).send({ [errormsg.message]: 'Forbidden' })

      const user = await User.findById(decoded._id)

      if (!user)
        return res.status(401).send({ [errormsg.message]: 'Unauthorized2' })

      const accessToken = user.generateAuthToken(
        process.env.ACCESS_TOKEN_SECRET,
        '15m'
      )

      res.send({ accessToken })
    }
  )
})

router.post('/logout', (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204)
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.send({ [errormsg.message]: 'Cookie cleared' })
})

const validate = function (user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(555).required().email(),
    password: Joi.string().min(8).max(255).required(),
  })
  return schema.validate(user)
}

module.exports = router
