const MissingParamError = require('./missing-param-error')

module.exports = class HttpResponse {
  static badRequest (errorName) {
    return {
      statusCode: 400,
      body: new MissingParamError(errorName)
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}
