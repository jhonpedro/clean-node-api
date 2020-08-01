const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.Model('User')

module.exports = () => {
  router.post('/singup', (req, res) => {
    const { email, password, repeatPassword } = req.body
    if (password === repeatPassword) {
      const user = User.create({ email, password })

      return res.json({ user })
    }

    return res.status(400).json({ error: 'Password must match' })
  })
}
