const verifyJWT = require('../middleware/verifyJWT')
const { Calendar, validateCalendar } = require('../models/Calendar')
const express = require('express')
const validate = require('../middleware/validate')
const router = express.Router()

const errormsg = require('../lib/errormsg')

router.get('/me', verifyJWT, async (req, res) => {})

router.get('/', verifyJWT, async (req, res) => {
  const calendar = await Calendar.find().lean()
  res.send(calendar)
})

router.get('/callendar/:id', verifyJWT, async (req, res) => {})

router.post('/', validate(validateCalendar), async (req, res) => {})

router.delete('/', async (req, res) => {})

module.exports = router
