class TokenGenerator {
  async generate (id) {
    return null
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

    const token = await sut.generate('any_id')
    expect(token).toBe(null)
  })
})
