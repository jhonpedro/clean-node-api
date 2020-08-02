const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepository, encrypterSpy) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypterSpy = encrypterSpy
  }

  async auth (email, password) {
    try {
      if (!email) {
        throw new MissingParamError('email')
      }
      if (!password) {
        throw new MissingParamError('password')
      }
      const user = await this.loadUserByEmailRepository.load(email)
      if (user) {
        const isValid = await this.encrypterSpy.compare(password, user.password)
        if (isValid) {

        } else {
          return null
        }
      } else {
        return null
      }
    } catch (error) {
      console.log(error.message)
      throw new InvalidParamError(error.message)
    }
  }
}
