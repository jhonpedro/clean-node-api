class LoadUserByEmailRepository {
  load (email) {
    return null
  }
}

const makeSut = () => {
  const loadUserByEmailRepository = new LoadUserByEmailRepository()

  return {
    sut: loadUserByEmailRepository
  }
}

describe('Load user by email repository', () => {
  test('Should return null if repository returns null', async () => {
    const { sut } = makeSut()

    const user = await sut.load('invalid@email.com')
    expect(user).toBeNull()
  })
})
