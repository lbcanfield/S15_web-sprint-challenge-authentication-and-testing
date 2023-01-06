const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

// Write your tests here
test('sanity', () => {
     expect(true).toBe(!false)
})

beforeAll(async () => {
     await db.migrate.rollback()
     await db.migrate.latest()
})
// beforeEach(async () => {
//      await db.seed.run()
// })
afterAll(async () => {
     await db.destroy()
})

describe('[POST] /api/auth/register', () => {
     const dogs = ['Buddy', 'Rex', 'Dizel']
     const passwords = ['ilikemytreats', 'rubmybellyplease', 'yourfingersaretastey']
     it('[1] responds with the correct username', async () => {
          const response = await request(server).post('/api/auth/register').send({ username: 'Jennifer', password: 'buddy001' })
          expect(response.body.username).toMatch('Jennifer')
     })
     it('[2] responds with the correct number of users', async () => {
          for (let i = 0; i < dogs.length; i += 1) {
               await request(server).post('/api/auth/register').send({ username: dogs[i], password: passwords[i] })
          }
          expect(await db('users')).toHaveLength(4)
     })
     it('[3] responds with the correct error message if no username is sent', async () => {
          const response = await request(server).post('/api/auth/register').send({ password: '12345' })
          expect(response.body.message).toMatch('username and password required')
     })
     it('[4] responds with the correct error message if no password is sent', async () => {
          const response = await request(server).post('/api/auth/register').send({ username: 'Jennifer' })
          expect(response.body.message).toMatch('username and password required')
     })
     it('[5] responds with the correct error message if username is already taken', async () => {
          const response = await request(server).post('/api/auth/register').send({ username: 'Jennifer', password: 'buddy001' })
          expect(response.body.message).toMatch('Username Taken')
     })
})

describe('[POST] /api/auth/login', () => {
     const value = { username: 'Jennifer', password: 'buddy001' }
     const dogs = ['Buddy', 'Rex', 'Dizel']
     const passwords = ['ilikemytreats', 'rubmybellyplease', 'yourfingersaretastey']
     it('[6] responds with the correct message when a user logs in', async () => {
          const response = await request(server).post('/api/auth/login').send(value)
          expect(response.status).toBe(200)
          for (let i = 0; i < dogs.length; i += 1) {
               const response = await request(server).post('/api/auth/login').send({ username: dogs[i], password: passwords[i] })
               expect(response.status).toBe(200)
          }
     })
     it('[7] responds with the correct error message if no username is sent', async () => {
          const response = await request(server).post('/api/auth/login').send({ password: '12345' })
          expect(response.body.message).toMatch('username and password required')
     })
     it('[8] responds with the correct error message if no password is sent', async () => {
          const response = await request(server).post('/api/auth/login').send({ username: 'Jennifer' })
          expect(response.body.message).toMatch('username and password required')
     })
     it('[9] responds with the correct error message if username is not in the database', async () => {
          const response = await request(server).post('/api/auth/login').send({ username: `${value.username}1`, password: `${value.password}` })
          expect(response.body.message).toMatch('invalid credentials')
     })
     it('[10] responds with the correct error status if password does not match', async () => {
          for (let i = 0; i < dogs.length; i += 1) {
               const response = await request(server).post('/api/auth/login').send({ username: `${dogs[i]}`, password: `${passwords[i]}1` })
               expect(response.status).toBe(401)
          }
     })


})

