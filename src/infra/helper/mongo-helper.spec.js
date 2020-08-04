const MongoHelper = require('./mongo-helper')

describe('Mongo helper', () => {
  test('Should reconnect mongo helper if its disconnected', async () => {
    const sut = MongoHelper
    await sut.connect(process.env.MONGO_URL)
    expect(sut).toBeTruthy()
    sut.closeConnection()
    sut.getDb()
    expect(sut.db).toBeTruthy()
  })
})
