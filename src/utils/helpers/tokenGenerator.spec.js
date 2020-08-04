const JWT = require('jsonwebtoken')
const TokenGenerator = require('./token-generator')

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

  test('Should throw if no secret is provided', async () => {
    const sut = new TokenGenerator()

    const promise = sut.generate('any_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if no id is provided', async () => {
    const { sut } = makeSut()

    const promise = sut.generate()
    await expect(promise).rejects.toThrow()
  })
})
