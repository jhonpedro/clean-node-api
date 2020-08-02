const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    return true
  }
}

const makeSut = () => {
  const authUseCasespy = new AuthUseCase()
  return authUseCasespy
}

describe('Auth UseCase', () => {
  test('Auth use case throw if email is not provided', async () => {
    const sut = makeSut()

    const promise = sut.auth(null, 'valid_password')
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Auth use case throw if password is not provided', async () => {
    const sut = makeSut()

    const promise = sut.auth('valid_Email', 'valid_password')
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
