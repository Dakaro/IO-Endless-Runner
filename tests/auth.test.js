const request = require('supertest')
const app = require('../server')

it("Async test", async () => {
    const response = await request.get("/auth/login")
    expect(response.status).toBe(200)
})