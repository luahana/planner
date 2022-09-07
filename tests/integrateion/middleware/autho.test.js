const { User } = require('../../../models/user')
const request = require('supertest')
const app = require('../../../index')

describe('auth middleware', () => {
  let token

  const exec = () => {
    return request(app).get('/api/users').set('x-auth-token', token)
  }

  beforeEach(() => {
    token = new User().generateAuthToken()
  })

  it('should return 401 if no token is provided', async () => {
    token = ''

    const res = await exec()

    expect(res.status).toBe(401)
  })

  it('should return 400 if token is invalid', async () => {
    token = 'a'

    const res = await exec()

    expect(res.status).toBe(400)
  })

  it('should return 200 if token is valid', async () => {
    const res = await exec()

    expect(res.status).toBe(200)
  })
})
