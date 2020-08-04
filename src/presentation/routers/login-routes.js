const HttpResponse = require('../helpers/http-response')
const { InvalidParamError, MissingParamError } = require('../../utils/errors')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }

      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }

      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }

      const acessToken = await this.authUseCase.auth(email, password)

      if (acessToken) {
        return HttpResponse.ok({ acessToken })
      } else {
        return HttpResponse.unauthorizedError()
      }
    } catch (error) {
      console.log(error)
      return HttpResponse.serverError()
    }
  }
}
