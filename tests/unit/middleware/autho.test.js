const { User } = require('../../../models/user')
const autho = require('../../../middleware/autho')
const mongoose = require('mongoose')

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = { _id: mongoose.Types.ObjectId(), isAdmin: true }
    const token = new User(user).generateAuthToken()
    const req = {
      header: jest.fn().mockReturnValue(token),
    }
    const res = {}
    const next = jest.fn()

    autho(req, res, next)

    expect(req.user).toMatchObject(user)
  })
})
