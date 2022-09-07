const request = require('supertest')
const app = require('../../../index')
const { User } = require('../../../models/user')
const mongoose = require('mongoose')

describe('/api/users', () => {
  afterEach(async () => {
    await User.deleteMany({})
  })

  describe('GET /me', () => {
    let token
    const exec = () => {
      return request(app).get('/api/users/me').set('x-auth-token', token)
    }

    beforeEach(() => {
      token = new User().generateAuthToken()
    })

    it('should return 200 if in valid request', async () => {
      const res = await exec()

      expect(res.status).toBe(200)
    })

    it('should not have password in response', async () => {
      const res = await exec()

      expect(res.body).not.toHaveProperty('password')
    })
  })

  describe('GET /', () => {
    it('should return all users', async () => {
      await User.collection.insertMany([
        { name: 'Planner Test', email: 'Test1@gmail.com' },
        { name: 'Planner1 Test', email: 'Test2@gmail.com' },
      ])
      const res = await request(app)
        .get('/api/users')
        .set('x-auth-token', new User().generateAuthToken())
        .set('Accept', 'application/json')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(
        res.body.some(
          (u) => u.name === 'Planner Test' && u.email === 'Test1@gmail.com'
        )
      ).toBeTruthy()
      expect(
        res.body.some(
          (u) => u.name === 'Planner1 Test' && u.email === 'Test2@gmail.com'
        )
      ).toBeTruthy()
    })
  })

  describe('GET /:id', () => {
    let id
    const exec = () => {
      return request(app).get('/api/users/' + id)
    }

    it('should return a user if valid id is passed', async () => {
      const user = new User({
        name: 'Planner Test',
        email: 'Planner1@gmail.com',
        password: '123456',
      })
      await user.save()
      id = user.id
      const res = await exec()
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('_id', user.id)
    })

    it('should return 404 if invalid id is passed', async () => {
      id = new mongoose.Types.ObjectId()
      const res = await exec()
      expect(res.status).toBe(404)
    })
  })

  describe('POST /', () => {
    let name
    let email
    let password
    let token

    beforeEach(() => {
      name = 'Planner Test'
      email = 'Planner@gmail.com'
      password = '123456'
    })

    const exec = (name, email, password) => {
      return request(app)
        .post('/api/users')
        .send({
          name,
          email,
          password,
        })
        .set('x-auth-token', token)
    }

    it('should return 400 if email is already registered', async () => {
      token = ''
      const user = new User({
        name,
        email,
        password,
      })
      await user.save()
      const res = await exec(name, email, password)

      console.log(res)
      expect(res.status).toBe(400)
    })

    it('should return 200 ', async () => {
      const res = await exec(name, email, password)

      expect(res.status).toBe(200)
    })

    it('should have email in body of response', async () => {
      const res = await exec(name, email, password)
      console.log(res)
      expect(res.body).toHaveProperty('email', email)
    })

    it('should have auth token', async () => {
      const res = await exec(name, email, password)

      expect(res.header).toHaveProperty('x-auth-token')
    })
  })
})
