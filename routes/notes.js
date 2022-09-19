const verifyJWT = require('../middleware/verifyJWT')
const validateObjectId = require('../middleware/validateObjectId')
const { Note, validateNote } = require('../models/Note')
const { User } = require('../models/User')
const express = require('express')
const validate = require('../middleware/validate')
const router = express.Router()
const errormsg = require('../lib/errormsg')

router.get('/me', verifyJWT, async (req, res) => {
  res.send()
})

router.get('/', verifyJWT, async (req, res) => {
  const notes = await Note.find().lean()

  if (!notes?.length) {
    return res.status(400).json({ [errormsg.message]: 'No notes found' })
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec()
      return { ...note, user }
    })
  )

  res.send(notesWithUser)
})

router.get('/note/:id', verifyJWT, async (req, res) => {
  res.send()
})

router.get('/:id', validateObjectId, async (req, res) => {
  res.send()
})

router.post('/', validate(validateNote), async (req, res) => {
  const { user, title, content, assignedDate } = req.body

  if (!user || !title || !assignedDate)
    return res
      .status(400)
      .send({ [errormsg.message]: 'All fields are required' })

  const note = await Note.create({ user, title, content, assignedDate })

  if (!note)
    return res
      .status(400)
      .send({ [errormsg.message]: 'Invalid note data received' })

  return res.status(200).send(note)
})

router.put('/', validate(validateNote), async (req, res) => {
  const { _id, user, title, content, completed } = req.body

  // Confirm data
  if (!_id || !user || !title || typeof completed !== 'boolean') {
    return res
      .status(400)
      .send({ [errormsg.message]: 'All fields are required' })
  }

  // Confirm note exists to update
  const note = await Note.findById(_id).exec()

  if (!note) {
    return res.status(400).send({ [errormsg.message]: 'Note not found' })
  }

  note.title = title
  note.content = content
  note.completed = completed

  const updatedNote = await note.save()

  res.send(updatedNote)
})

router.delete('/', async (req, res) => {
  res.json()
})

module.exports = router
