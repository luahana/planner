const request = require('supertest')
const app = require('../../../index')
const { User } = require('../../../models/user')

describe('/api/users', () => {
  afterEach(async () => {
    await User.deleteMany({})
  })

  describe('GET /', () => {
    it('should return all users', async () => {
      await User.collection.insertMany([
        { name: 'Alex Test', email: 'Test1@gmail.com' },
        { name: 'Alex1 Test', email: 'Test2@gmail.com' },
      ])
      const res = await request(app)
        .get('/api/users')
        .set('x-auth-token', new User().generateAuthToken())
        .set('Accept', 'application/json')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(
        res.body.some(
          (u) => u.name === 'Alex Test' && u.email === 'Test1@gmail.com'
        )
      ).toBeTruthy()
      expect(
        res.body.some(
          (u) => u.name === 'Alex1 Test' && u.email === 'Test2@gmail.com'
        )
      ).toBeTruthy()
    })
  })

  describe('GET /:id', () => {
    it('should return a user if valid id is passed', async () => {
      const user = new User({
        name: 'Alex Test',
        email: 'Test1@gmail.com',
        password: '123456',
      })
      await user.save()

      const res = await request(app).get('/api/users/' + user.id)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('_id', user.id)
    })

    it('should return 404 if idvalid email is passed', async () => {
      const res = await request(app).get('/api/users/1')
      expect(res.status).toBe(404)
    })
  })
})
