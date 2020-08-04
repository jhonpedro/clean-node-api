module.exports = class LoadUserByEmailRepository {
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
