const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}

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
})
