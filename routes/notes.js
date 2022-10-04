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

router.get('/:userId/:year/:month/:date', async (req, res) => {
  const year = req.params.year
  const month = req.params.month
  const date = req.params.date
  const userId = req.params.userId
  const dt = new Date(parseInt(year), parseInt(month - 1), parseInt(date))
  const didLength = year.length + month.length + date.length
  if (didLength !== 8) {
    return res
      .status(400)
      .json({ [errormsg.message]: 'year, month, date are not correct format' })
  }

  const notes = await Note.find({
    assignedDate: {
      $gte: new Date(dt.setHours(00, 00, 00)),
      $lte: new Date(dt.setHours(00, 00, 00)),
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

router.get('/:queryStr', verifyJWT, async (req, res) => {
  const [userIdStr, dateStr] = req.params.queryStr.split('-')

  if (dateStr) {
    const date = new Date(
      parseInt(dateStr.slice(0, 4)),
      parseInt(dateStr.slice(4, 6)),
      parseInt(dateStr.slice(6, 8))
    )

    const notes = await Note.find({
      assignedDate: {
        $gte: new Date(new Date(date).setHours(00, 00, 00)),
        $lt: new Date(new Date(date).setHours(23, 59, 59)),
      },
      user: userIdStr,
    }).lean()

    if (!notes)
      return res.status(404).send({ [errormsg.message]: 'Note not found' })

    res.send(notes)
  } else {
    const notes = await Note.find({
      assignedDate: null,
      user: userIdStr,
    }).lean()
    if (!notes)
      return res.status(404).send({ [errormsg.message]: 'Note not found' })

    res.send(notes)
  }
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

router.put('/', validate(validateNote), async (req, res) => {
  const { _id, user, title, content, completed, sets, assignedDate } = req.body
  // Confirm data
  if (!_id || !user || typeof completed !== 'boolean') {
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
  note.assignedDate = assignedDate

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
