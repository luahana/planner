const errormsg = require('../lib/errormsg')

module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body)
    console.log(error)
    if (error)
      return res
        .status(400)
        .send({ [errormsg.message]: error.details[0].message })

    next()
  }
}
