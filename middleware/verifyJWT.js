const jwt = require('jsonwebtoken')
const { errormsg } = require('../lib/errormsg')
require('../lib/dotenv')()

module.exports = function (req, res, next) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization

  if (!authHeader?.startsWith('bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log(err)
        return res
          .status(403)
          .send({ [errormsg.message]: err.message + 'Forbidden' })
      }
      req.user = decoded
      next()
    })
  } catch (ex) {
    res.status(400).send({ [errormsg.message]: 'Invalid token.' })
  }
}
