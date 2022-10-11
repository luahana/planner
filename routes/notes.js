const verifyJWT = require('../middleware/verifyJWT')
const validateObjectId = require('../middleware/validateObjectId')
const { Note, validateNote, validateNewNote } = require('../models/Note')
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
      if (!note.sets) note.sets = []
      return { ...note, user: user._id }
    })
  )

  res.send(notesWithUser)
})

router.get('/:userId/:from/:to', verifyJWT, async (req, res) => {
  const notes = await Note.find({
    user: req.params.userId,
    assignedTime: {
      $gte: req.params.from,
      $lte: req.params.to,
    },
    assigned: true,
  }).lean()

  return res.send(notes)
})

router.get('/:userId/unassigned', verifyJWT, async (req, res) => {
  const notes = await Note.find({
    user: req.params.userId,
    assigned: false,
  }).lean()

  return res.send(notes)
})

router.put('/', validate(validateNote), async (req, res) => {
  const { id, user, title, content, completed, sets, assignedTime, assigned } =
    req.body

  // Confirm data
  if (!user || typeof completed !== 'boolean') {
    return res
      .status(400)
      .send({ [errormsg.message]: 'All fields are required' })
  }

  if (!id) {
    const note = await Note.create({ ...req.body })
    note.title = title
    note.content = content
    note.completed = completed
    note.sets = sets
    note.assigned = assigned
    note.assignedTime = assignedTime

    const updatedNote = await note.save()

    return res.status(200).send(updatedNote)
  }

  // Confirm note exists to update
  const note = await Note.findById(id).exec()

  if (!note) {
    return res.status(400).send({ [errormsg.message]: 'Note not found' })
  }

  note.title = title
  note.content = content
  note.completed = completed
  note.sets = sets
  note.assigned = assigned
  note.assignedTime = assignedTime

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

router.get('/:userId/:year/:month', verifyJWT, async (req, res) => {
  const userId = req.params.userId
  const fromDate = new Date(
    parseInt(req.params.year),
    parseInt(req.params.month - 1),
    1
  )
  const toDate = new Date(
    parseInt(req.params.year),
    parseInt(req.params.month),
    0
  )

  const notes = await Note.find({
    assignedDate: {
      $gte: fromDate,
      $lte: toDate,
    },
    user: userId,
  }).lean()

  if (!notes?.length) {
    return res.send([])
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec()
      if (!note.sets) note.sets = []
      return { ...note, user: user._id }
    })
  )

  return res.send(notesWithUser)
})

router.post('/', validate(validateNewNote), async (req, res) => {
  const { user, assignedDate } = req.body

  if (!user || !assignedDate)
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

router.post('/updateUnassigned', async (req, res) => {
  const notes = await Note.find().lean()

  let noDate = 0
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].assignedTime < 0) {
      await Note.updateOne({ _id: notes[i]._id }, { $set: { assigned: false } })
    } else {
      await Note.updateOne({ _id: notes[i]._id }, { $set: { assigned: true } })
    }
    noDate++
  }

  return res.send({ noDate })
})

module.exports = router
