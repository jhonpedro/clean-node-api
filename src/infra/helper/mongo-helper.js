const { MongoClient } = require('mongodb')

module.exports = {
  async connect (url, dbName) {
    this.url = url
    this.dbName = dbName

    this.connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = await this.connection.db(dbName)
  },
  async closeConnection () {
    await this.connection.close()
  },
  async getDb () {
    const isConnected = await this.connection.isConnected()
    if (!isConnected) {
      await this.connect(this.url, this.dbName)
    }
    return this.db
  }
}
