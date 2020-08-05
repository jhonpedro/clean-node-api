const MongoHelper = require('../../infra/helper/mongo-helper')

class UpdtateAcessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  update (id, acessToken) {
    this.userModel.updateOne({
      _id: id
    }, {
      $set: {
        acessToken
      }
    })
  }
}

const makeSut = (db) => {
  const UserModel = db.collection('users')

  const updtateAcessTokenRepositorySpy = new UpdtateAcessTokenRepository(UserModel)

  return {
    sut: updtateAcessTokenRepositorySpy,
    userModel: UserModel
  }
}

const createFakeUser = async (userModel) => {
  const fakeUser = await userModel.insertOne({
    email: 'any_valid@email.com',
    name: 'Joao',
    age: 19,
    password: 'hashed_password'
  })

  return {
    fakeUser,
    id: fakeUser.ops[0]._id
  }
}

describe('UpdateAcessToken Repository', () => {
  let db

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })
  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })
  afterAll(async done => {
    await MongoHelper.closeConnection()
    done()
  })

  test('Should change the acess token in the userModel', async () => {
    const { sut, userModel } = makeSut(db)
    const { id } = await createFakeUser(userModel)
    await sut.update(id, 'any_acessToken')
    const userInDataBase = await userModel.findOne({
      _id: id
    })
    expect(userInDataBase.acessToken).toBe('any_acessToken')
  })
})
