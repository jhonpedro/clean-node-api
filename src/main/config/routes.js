const { Router } = require('express')
const router = Router()

module.exports = app => {
  app.use('/api', router)
  require('../routes/login-route')(router)
}
