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

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare () {
      throw new Error()
    }
  }
  return new EncrypterSpy()
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
    id: 'any_id',
    password: 'hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load () {
      throw new Error()
    }
  }
  return new LoadUserByEmailRepositorySpy()
}

const makeTokenGenerator = () => {
  class TokenGenerator {
    async generate (userId) {
      this.userId = userId
      return this.acessToken
    }
  }
  const tokenGeneratorSpy = new TokenGenerator()
  tokenGeneratorSpy.acessToken = 'any_token'
  return tokenGeneratorSpy
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate () {
      throw new Error()
    }
  }
  return new TokenGeneratorSpy()
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepository {
    async update (userId, acessToken) {
      this.userId = userId
      this.acessToken = acessToken
    }
  }
  return new UpdateAccessTokenRepository()
}

const makeUpdateAccessTokenRepositoryWithError = () => {
  class UpdateAccessTokenRepository {
    async update () {
      throw new Error()
    }
  }
  return new UpdateAccessTokenRepository()
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const tokenGeneratorSpy = makeTokenGenerator()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy
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

  test('Should return null if invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    const email = 'invalid_email@email.com'
    loadUserByEmailRepositorySpy.user = null

    const acessToken = await sut.auth(email, 'password')
    await expect(acessToken).toBeNull()
  })

  test('Should return null if wrong password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const email = 'valid_email@email.com'
    const password = 'invalid_password'

    const acessToken = await sut.auth(email, password)
    await expect(acessToken).toBeNull()
  })

  test('Should call encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    const email = 'valid_email@email.com'
    const password = 'valid_password'

    await sut.auth(email, password)
    await expect(encrypterSpy.password).toBe(password)
    await expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('Should call TokenGenerator with correct UserID', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    const email = 'valid_email@email.com'
    const password = 'valid_password'

    await sut.auth(email, password)
    await expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('Should return Acess token if valid params are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const email = 'valid_email@email.com'
    const password = 'valid_password'

    const acessToken = await sut.auth(email, password)
    await expect(acessToken).toBe(tokenGeneratorSpy.acessToken)
    await expect(acessToken).toBeTruthy()
  })

  test('Should return correct Acess Token when call UpdateAccessTokenRepository', async () => {
    const { sut, updateAccessTokenRepositorySpy, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    const email = 'valid_email@email.com'
    const password = 'valid_password'

    await sut.auth(email, password)
    await expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    await expect(updateAccessTokenRepositorySpy.acessToken).toBe(tokenGeneratorSpy.acessToken)
  })

  test('Should throw if dependencies are not provided or that dependencies are invalid', async () => {
    const invalidDependency = {}
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({
        loadUserByEmailRepository: null,
        encrypter: null,
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository: invalidDependency,
        encrypter: null,
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: null,
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: invalidDependency,
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalidDependency
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: invalidDependency
      })
    )
    const email = 'valid_email@email.com'

    for (const sut of suts) {
      const promise = sut.auth(email, 'password')
      await expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if dependencies throws', async () => {
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()
    const updateAccessTokenRepository = makeUpdateAccessTokenRepository()
    const suts = [].concat(
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError(),
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError(),
        tokenGenerator,
        updateAccessTokenRepository
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError(),
        updateAccessTokenRepository
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError(),
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError()
      })
    )
    const email = 'valid_email@email.com'

    for (const sut of suts) {
      const promise = sut.auth(email, 'password')
      await expect(promise).rejects.toThrow()
    }
  })
})
