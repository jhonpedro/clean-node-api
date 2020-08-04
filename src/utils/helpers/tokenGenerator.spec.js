const JWT = require('jsonwebtoken')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (id) {
    const token = JWT.sign(id, this.secret)
    this.token = token
    this.id = id
    return token
  }
}
const makeSut = () => {
  const tokenGeneratorSpy = new TokenGenerator('secret')

  return {
    sut: tokenGeneratorSpy
  }
}

describe('Token Generator', () => {
  test('Should return null if token generetor returns null', async () => {
    const { sut } = makeSut()
    JWT.token = null

    const token = await sut.generate('any_id')
    expect(token).toBe(null)
  })

  test('Should return a token if jwt returns a token', async () => {
    const { sut } = makeSut()

    const token = await sut.generate('any_id')
    expect(token).toBe(sut.token)
  })

  test('Should call token generator with correct values', async () => {
    const { sut } = makeSut()

    await sut.generate('any_id')
    expect(sut.id).toBe('any_id')
    expect(sut.secret).toBe('secret')
  })
})
