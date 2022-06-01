import supertest from 'supertest'
const authRouter = require('../routes/auth')

describe("POST /register", () => {
    
    describe("username and password given", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(authRouter).post('/register').send({
                username: "username",
                password: "password"
            })
            expect(response.statusCode).toBe(200)
        })
    })
    
    describe("username or password missing", () => {
        
    })
    
})