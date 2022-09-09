const _ = require('lodash')
const validateObjectId = require('../middleware/validateObjectId')
const { Note, validateNote } = require('../models/Note')
const express = require('express')
const validate = require('../middleware/validate')
const router = express.Router()
const errormsg = require('../lib/errormsg')

router.get('/me', verifyJWT, async (req, res) => {
  res.send()
})

router.get('/', verifyJWT, async (req, res) => {
  res.send()
})

router.get('/user/:id', verifyJWT, async (req, res) => {
  res.send()
})

router.get('/:id', validateObjectId, async (req, res) => {
  res.send()
})

router.post('/', validate(validateUser), async (req, res) => {
  res.send()
})

router.put('/', validate(validateUser), async (req, res) => {
  res.send()
})

router.delete('/', async (req, res) => {
  res.json()
})

module.exports = router
