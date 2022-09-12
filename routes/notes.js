const verifyJWT = require('../middleware/verifyJWT')
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
  const notes = await Note.find().lean()

  if (!notes?.length) {
    return res.status(400).json({ [errormsg.message]: 'No notes found' })
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.email).lean().exec()
      return { ...note, email: user.email }
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
  const { user, title, text } = req.body

  // Confirm data
  if (!user || !title || !text)
    return res
      .status(400)
      .send({ [errormsg.message]: 'All fields are required' })

  const note = await Note.create({ user, title, text })

  if (!note)
    return res
      .status(400)
      .send({ [errormsg.message]: 'Invalid note data received' })

  return res.status(201).json({ [errormsg.message]: 'New note created' })
})

router.put('/', validate(validateNote), async (req, res) => {
  const { id, title, text, completed } = req.body

  // Confirm data
  if (!id || !title || !text || typeof completed !== 'boolean') {
    return res
      .status(400)
      .send({ [errormsg.message]: 'All fields are required' })
  }

  // Confirm note exists to update
  const note = await Note.findById(id).exec()

  if (!note) {
    return res.status(400).send({ [errormsg.message]: 'Note not found' })
  }

  note.title = title
  note.text = text
  note.completed = completed

  const updatedNote = await note.save()

  res.send(updatedNote)
})

router.delete('/', async (req, res) => {
  res.json()
})

module.exports = router
