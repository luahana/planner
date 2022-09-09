const { User } = require('../../../models/user')
const jwt = require('jsonwebtoken')
require('../../../lib/dotenv')()
const { default: mongoose } = require('mongoose')

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const payload = { _id: new mongoose.Types.ObjectId(), isAdmin: true }
    const user = new User(payload)
    const token = user.generateAuthToken(process.env.ACCESS_TOKEN_SECRET)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    expect(decoded).toMatchObject(payload)
  })
})
