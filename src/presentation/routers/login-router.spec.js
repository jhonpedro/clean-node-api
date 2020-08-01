class LoginRouter {
  route (httpRequest) {
    const { email } = httpRequest.body
    if (!email) {
      return {
        statusCode: 400
      }
    }
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
  })
})
