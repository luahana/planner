const { User } = require('../../../models/user')
const verifyJWT = require('../../../middleware/verifyJWT')
const mongoose = require('mongoose')

describe('verifyJWT middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: mongoose.Types.ObjectId(),
      email: 'test@gmail.com',
      roles: ['user'],
      isAdmin: true,
    }
    const token = new User(user).generateAuthToken(
      process.env.ACCESS_TOKEN_SECRET
    )

    const req = {
      headers: { authorization: `bearer ${token}` },
    }
    const res = {}
    const next = jest.fn()

    verifyJWT(req, res, next)

    expect(req.user).toMatchObject(user)
  })
})
