const request = require('supertest')
const app = require('./app')

describe('App setup', () => {
  test('Should disbale x-powered-by', async () => {
    app.get('/test', (req, res) => {
      res.send('ola')
    })

    const res = await request(app)
      .get('/test')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })
})
