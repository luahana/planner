const request = require('supertest')
const app = require('../../../index')
const { User } = require('../../../models/user')

describe('/api/auth', () => {
  describe('POST /', () => {
    let email
    let password

    beforeEach(() => {
      email = 'PlannerAuth@gmail.com'
      password = '123456'
    })

    afterEach(async () => {
      await User.deleteMany({})
    })

    const exec = () => {
      return request(app).post('/api/auth').send({
        email,
        password,
      })
    }

    it('should return 400 if email and/or password does not meet the validate condition', async () => {
      email = '123'
      password = '123'
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if email does not exist in the server', async () => {
      const user = new User({
        name: 'Planner Test',
        email: 'different@gmail.com',
        password,
      })
      await user.save()

      // await User.findOne({ email })
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if password does not match', async () => {
      const user = new User({
        name: 'Planner Test',
        email,
        password: 'different',
      })
      await user.save()

      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 200 if correct email and password is provided', async () => {
      const user = new User({
        name: 'Planner Test',
        email,
        password,
      })
      user.password = await user.generateHashedPassword(password)
      await user.save()

      const res = await exec()
      expect(res.status).toBe(200)
    })
  })
})
