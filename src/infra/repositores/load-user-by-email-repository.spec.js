const LoadUserByEmailRepository = require('./load-user-by-em-repository')
const MongoHelper = require('../helper/mongo-helper')

const makeSut = (db) => {
  const userModel = db.collection('users')
  const loadUserByEmailRepository = new LoadUserByEmailRepository(userModel)

  return {
    sut: loadUserByEmailRepository,
    userModel
  }
}

describe('Load user by email repository', () => {
  let db

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    MongoHelper.closeConnection()
  })

  test('Should return null if repository returns null', async () => {
    const { sut } = makeSut(db)

    const user = await sut.load('invalid@email.com')
    expect(user).toBeNull()
  })

  test('Should return user if repository returns a user', async () => {
    const email = 'valid@email.com'
    const { sut, userModel } = makeSut(db)
    const fakeUser = await userModel.insertOne({
      email,
      name: 'Joao',
      age: 19,
      password: 'hashed_password'
    })

    const user = await sut.load(email)
    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })

  test('Should throw if User model is not provided', async () => {
    const sut = new LoadUserByEmailRepository()

    const promise = sut.load('invalid@email.com')
    await expect(promise).rejects.toThrow()
  })
  test('Should throw if email is not provided', async () => {
    const { sut } = makeSut(db)

    const promise = sut.load(null)
    await expect(promise).rejects.toThrow()
  })
})
