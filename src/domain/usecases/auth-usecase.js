const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor ({ loadUserByEmailRepository, updateAccessTokenRepository, encrypter, tokenGenerator } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.updateAccessTokenRepository = updateAccessTokenRepository
    this.encrypterSpy = encrypter
    this.tokenGeneratorSpy = tokenGenerator
  }

  async auth (email, password) {
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
        const acessToken = await this.tokenGeneratorSpy.generate(user.id)
        await this.updateAccessTokenRepository.update(user.id, acessToken)
        return acessToken
      }
    }

    return null
  }
}
