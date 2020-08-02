const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email) {
    if (email) {

    } else {
      throw new MissingParamError('email')
    }
  }
}

const makeSut = () => {
  const authUseCasespy = new AuthUseCase()
  return authUseCasespy
}

describe('Auth UseCase', () => {
  test('Auth use case throw if email is not provided', async () => {
    const sut = makeSut()

    const promise = sut.auth()
    expect(promise).rejects.toThrow()
  })
})
