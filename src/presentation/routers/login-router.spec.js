class LoginRouter {
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

class HttpResponse {
  static badRequest (errorName) {
    return {
      statusCode: 400,
      body: new MissingParamError(errorName)
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}

class MissingParamError extends Error {
  constructor (paramName) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}

describe('Login route', () => {
  test('Should return 400 if email is not provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'aaa'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if password is not provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'aaa'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 400 if httpRequest has no body', () => {
    const sut = new LoginRouter()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
  test('Should return 500 if httpRequest is not provided', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })
})
