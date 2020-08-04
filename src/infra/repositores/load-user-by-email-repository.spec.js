const { MongoClient } = require('mongodb')

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  load (email) {
    const user = this.userModel.findOne({
      email
    }, {
      projection: {
        password: 1
      }
    })
    return user
  }
}

const makeSut = (db) => {
  const userModel = db.collection('users')
  const loadUserByEmailRepository = new LoadUserByEmailRepository(userModel)

  return {
    sut: loadUserByEmailRepository,
    userModel
  }
}

describe('Load user by email repository', () => {
  let connection
  let db

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })
  afterAll(async () => {
    await connection.close()
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
})
