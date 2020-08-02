const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError('loadUserByEmailRepository')
    }
    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError('loadUserByEmailRepository.load()')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      return null
    }
  }
}

const makeSut = () => {
  class LoadUserByEmailRepository {
    async load (email) {
      this.email = email
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)

  return {
    sut,
    loadUserByEmailRepositorySpy
  }
}

describe('Auth UseCase', () => {
  test('Auth use case throw if email is not provided', async () => {
    const { sut } = makeSut()

    const promise = sut.auth(null, 'valid_password')
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Auth use case throw if password is not provided', async () => {
    const { sut } = makeSut()

    const promise = sut.auth('valid_Email', 'valid_password')
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const email = 'valid_email@email.com'

    await sut.auth(email, 'password')
    expect(loadUserByEmailRepositorySpy.email).toEqual(email)
  })

  test('Should throw if LoadByEmailRepo is not provided', async () => {
    const sut = new AuthUseCase()
    const email = 'valid_email@email.com'

    const promise = sut.auth(email, 'password')
    await expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })

  test('Should throw if LoadByEmailRepo has no load method', async () => {
    const sut = new AuthUseCase({})
    const email = 'valid_email@email.com'

    const promise = sut.auth(email, 'password')
    await expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository.load()'))
  })

  test('Should return null if LoadByEmailRepo returns null', async () => {
    const { sut } = makeSut()
    const email = 'valid_email@email.com'

    const acessToken = await sut.auth(email, 'password')
    await expect(acessToken).toBeNull()
  })
})
