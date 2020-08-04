const { MissingParamError } = require('../errors')
const JWT = require('jsonwebtoken')

module.exports = class TokenGenerator {
  constructor (secret = '') {
    this.secret = secret
  }

  async generate (id) {
    if (!this.secret) {
      MissingParamError('secret')
    }
    if (!id) {
      MissingParamError('id')
    }

    const token = JWT.sign(id, this.secret)
    this.token = token
    this.id = id
    return token
  }
}
