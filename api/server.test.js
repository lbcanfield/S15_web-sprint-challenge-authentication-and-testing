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

describe('[POST] /hobbits', () => {
     const value = { username: "ddddddd", password: "1234" }
     test('adds a user to the database', async () => {
          await request(server).post('/register').send(value)
          expect(await db('users')).toHaveLength(1)
     })
     // test('responds with the new hobbit', async () => {
     //      const res = await request(server).post('/hobbits').send(value)
     //      expect(res.body).toMatchObject(value)
     // })
})