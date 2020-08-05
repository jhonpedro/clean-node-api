const request = require('supertest')
const app = require('../config/app')

describe('JSON parser', () => {
  test('Should parse body as JSON', async () => {
    app.post('/test_json', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_json')
      .send({ email: 'Joao' })
      .expect({ email: 'Joao' })
  })
})
