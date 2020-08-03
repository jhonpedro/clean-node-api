const bcrypt = require('bcrypt')
const Encrypter = require('./encrypter')

const makeEncrypter = () => {
  const encrypterSpy = new Encrypter()
  return encrypterSpy
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()

  return {
    sut: encrypterSpy
  }
}

describe('Encrypter', () => {
  test('Should return true if Encrypter returns true', async () => {
    const { sut } = makeSut()

    const isValid = await sut.compare('value', 'hash')
    expect(isValid).toBe(true)
  })

  test('Should return false if Encrypter returns false', async () => {
    const { sut } = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('value', 'hash')
    expect(isValid).toBe(false)
  })

  test('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut()

    await sut.compare('value_test', 'hash_test')
    expect(sut.value).toBe('value_test')
    expect(sut.hash).toBe('hash_test')
  })

  test('Should throw if value is not provided', async () => {
    const { sut } = makeSut()

    const promise = sut.compare(null, 'hash_test')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if hash is not provided', async () => {
    const { sut } = makeSut()

    const promise = sut.compare('value_test', null)
    expect(promise).rejects.toThrow()
  })
})
