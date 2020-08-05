const { MissingParamError } = require('../../utils/errors')

module.exports = class UpdtateAcessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (id, acessToken) {
    if (!id) {
      throw new MissingParamError('id')
    }
    if (!acessToken) {
      throw new MissingParamError('acessToken')
    }
    await this.userModel.updateOne({
      _id: id
    }, {
      $set: {
        acessToken
      }
    })
  }
}
