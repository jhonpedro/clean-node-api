const JWT = require('jsonwebtoken')

class TokenGenerator {
  async generate (id) {
    const token = JWT.sign(id, 'secret')
    this.token = token
    return token
  }
}
const makeSut = () => {
  const tokenGeneratorSpy = new TokenGenerator()

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
})
