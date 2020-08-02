const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncryperSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encryperSpy = new EncryperSpy()
  encryperSpy.isValid = true

  return encryperSpy
}

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepository {
    async load (email) {
      this.email = email

      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepository()
  loadUserByEmailRepositorySpy.user = {
    password: 'hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeSut = () => {
  const encryperSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encryperSpy)

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encryperSpy
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
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadByEmailRepo has no load method', async () => {
    const sut = new AuthUseCase({})
    const email = 'valid_email@email.com'

    const promise = sut.auth(email, 'password')
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const email = 'invalid_email@email.com'
    loadUserByEmailRepositorySpy.user = null

    const acessToken = await sut.auth(email, 'password')
    await expect(acessToken).toBeNull()
  })

  test('Should return null if wrong password is provided', async () => {
    const { sut, encryperSpy } = makeSut()
    encryperSpy.isValid = false
    const email = 'valid_email@email.com'

    const acessToken = await sut.auth(email, 'invalid_password')
    await expect(acessToken).toBeNull()
  })

  test('Should call encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encryperSpy } = makeSut()
    const email = 'valid_email@email.com'
    const password = 'valid_password'

    await sut.auth(email, password)
    await expect(encryperSpy.password).toBe(password)
    await expect(encryperSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })
})
