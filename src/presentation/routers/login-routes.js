const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (httpRequest && httpRequest.body && this.authUseCase && this.authUseCase.auth) {
      const { email, password } = httpRequest.body

      if (!email) {
        return HttpResponse.badRequest('email')
      }

      if (!password) {
        return HttpResponse.badRequest('password')
      }
      const acessToken = this.authUseCase.auth(email, password)
      if (acessToken) {
        return HttpResponse.ok()
      } else {
        return HttpResponse.unauthorizedError()
      }
    } else {
      return HttpResponse.serverError()
    }
  }
}
