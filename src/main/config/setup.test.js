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

  test('Should enable cors', async () => {
    app.get('/test_cors', (req, res) => {
      res.send('test_cors')
    })

    const res = await request(app)
      .get('/test')
    expect(res.headers['access-control-allow-origin']).toBe('*')
    expect(res.headers['access-control-allow-methods']).toBe('*')
    expect(res.headers['access-control-allow-headers']).toBe('*')
  })
})
