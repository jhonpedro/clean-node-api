const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return HttpResponse.badRequest('email')
      }

      if (!password) {
        return HttpResponse.badRequest('password')
      }
      const acessToken = await this.authUseCase.auth(email, password)
      if (acessToken) {
        return HttpResponse.ok({ acessToken })
      } else {
        return HttpResponse.unauthorizedError()
      }
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
