const { User } = require('../../../models/user')
const request = require('supertest')
const app = require('../../../index')

describe('verifyJWT middleware', () => {
  let token

  const exec = () => {
    return request(app)
      .get('/api/users')
      .set('Authorization', 'bearer ' + token)
  }

  beforeEach(async () => {
    token = new User({
      name: 'test1',
      email: 'test@gmail.com',
      password: 'qwerqwer',
      isAdmin: true,
    }).generateAuthToken(process.env.ACCESS_TOKEN_SECRET)
    await User.collection.insertMany([
      { name: 'Planner Test', email: 'Test1@gmail.com', password: '12345' },
      { name: 'Planner1 Test', email: 'Test2@gmail.com', password: '12345' },
    ])
  })

  afterEach(async () => {
    await User.deleteMany({})
  })

  it('should return 401 if no token is provided', async () => {
    token = ''

    const res = await exec()

    expect(res.status).toBe(401)
  })

  it('should return 403 if token is invalid', async () => {
    token = 'a'

    const res = await exec()

    expect(res.status).toBe(403)
  })

  it('should return 200 if token is valid', async () => {
    const res = await exec()

    expect(res.status).toBe(200)
  })
})
