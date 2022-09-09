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
      return request(app)
        .get('/api/users/me')
        .set('Authorization', 'bearer ' + token)
    }

    beforeEach(() => {
      token = new User().generateAuthToken(process.env.ACCESS_TOKEN_SECRET)
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
    it('should return all users if the request user is admin', async () => {
      await User.collection.insertMany([
        { name: 'Planner Test', email: 'Test1@gmail.com', password: '12345' },
        { name: 'Planner1 Test', email: 'Test2@gmail.com', password: '12345' },
      ])

      const res = await request(app)
        .get('/api/users')
        .set(
          'Authorization',
          'bearer ' +
            new User({
              name: 'test',
              email: 'test@gmail.com,',
              isAdmin: true,
            }).generateAuthToken(process.env.ACCESS_TOKEN_SECRET)
        )
        .set('Accept', 'application/json')
      expect(res.status).toBe(200)
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
      return request(app)
        .get('/api/users/' + id)
        .set(
          'Authorization',
          'bearer ' +
            new User({
              name: 'test',
              email: 'test@gmail.com,',
              isAdmin: true,
            }).generateAuthToken(process.env.ACCESS_TOKEN_SECRET)
        )
    }

    it('should return 404 if invalid id is passed', async () => {
      id = new mongoose.Types.ObjectId()
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should return a user if valid id is passed and the request user is admin', async () => {
      const user = new User({
        name: 'Planner Test',
        email: 'Planner1@gmail.com',
      })
      const password = '12345678'
      user.password = await user.generateHashedPassword(password)
      await user.save()
      id = user.id
      const res = await exec()
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('_id', user.id)
    })
  })

  describe('POST /', () => {
    let name
    let email
    let password

    beforeEach(() => {
      name = 'Planner Test'
      email = 'PlannerUser@gmail.com'
      password = '12345678'
    })

    const exec = () => {
      return request(app).post('/api/users').send({
        name,
        email,
        password,
      })
    }

    it('should return 400 if email is already registered', async () => {
      const user = new User({
        name,
        email,
        password,
      })
      user.password = await user.generateHashedPassword(password)
      await user.save()

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 200 ', async () => {
      const res = await exec()

      expect(res.status).toBe(200)
    })

    it('should have email in body of response', async () => {
      const res = await exec()
      expect(res.body).toHaveProperty('email', email)
    })

    it('should have auth token', async () => {
      const res = await exec()

      expect(res.header).toHaveProperty('authorization' || 'Authorization')
    })
  })
})
