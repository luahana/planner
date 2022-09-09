const jwt = require('jsonwebtoken')
const { errormsg } = require('../lib/errormsg')
require('../lib/dotenv')()

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token')
  if (!token)
    return res
      .status(401)
      .send({ [errormsg.message]: 'Access denied. No token provided' })

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).send({ [errormsg.message]: 'Forbidden' })
      req.user = decoded
      next()
    })
  } catch (ex) {
    res.status(400).send({ [errormsg.message]: 'Invalid token.' })
  }
}
