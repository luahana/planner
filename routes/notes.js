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
      return { ...note, user: user._id }
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
  const { user, title, assignedDate } = req.body

  if (!user || !title || !assignedDate)
    return res
      .status(400)
      .send({ [errormsg.message]: 'All fields are required' })

  const note = await Note.create({ ...req.body })

  if (!note)
    return res
      .status(400)
      .send({ [errormsg.message]: 'Invalid note data received' })

  return res.status(200).send(note)
})

router.put('/', validate(validateNote), async (req, res) => {
  const { _id, user, title, content, completed, sets } = req.body

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
  note.sets = sets

  const updatedNote = await note.save()

  res.send(updatedNote)
})

router.delete('/', async (req, res) => {
  const { id } = req.body

  if (!id) return res.status(400).send({ [errormsg.message]: 'id is required' })

  const note = await Note.findById(id)
  if (!note)
    return res.status(400).send({ [errormsg.message]: 'note not found' })
  await note.deleteOne()

  res.json({
    [errormsg.message]: `Note, ${note._id} is deleted`,
  })
})

module.exports = router
