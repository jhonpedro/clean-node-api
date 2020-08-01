const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  route (httpRequest) {
    if (httpRequest && httpRequest.body) {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest('email')
      }
      if (!password) {
        return HttpResponse.badRequest('password')
      }
    } else {
      return HttpResponse.serverError()
    }
  }
}
