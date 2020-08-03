const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    this.value = value
    this.hash = hash

    const isValid = await bcrypt.compare(this.value, this.hash)
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

  test('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut()

    await sut.compare('value_test', 'hash_test')
    expect(sut.value).toBe('value_test')
    expect(sut.hash).toBe('hash_test')
  })
})
