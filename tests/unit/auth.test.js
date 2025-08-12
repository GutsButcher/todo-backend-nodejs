const auth = require('../../src/middleware/auth')
const User = require('../../src/models/user')
const jwt = require('jsonwebtoken')

let testUser
let authToken

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret'
})

beforeEach(async () => {
  await User.deleteMany()
  
  testUser = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'MyPass777!'
  })
  await testUser.save()
  authToken = await testUser.generateAuthToken()
})

describe('Auth Middleware Tests', () => {
  test('Should authenticate user with valid token', async () => {
    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${authToken}`)
    }
    const res = {}
    const next = jest.fn()
    
    await auth(req, res, next)
    
    expect(req.user).toBeDefined()
    expect(req.user._id.toString()).toBe(testUser._id.toString())
    expect(req.token).toBe(authToken)
    expect(next).toHaveBeenCalled()
  })

  test('Should fail with missing Authorization header', async () => {
    const req = {
      header: jest.fn().mockReturnValue(undefined)
    }
    const res = {
      status: jest.fn().mockReturnValue({
        send: jest.fn()
      })
    }
    const next = jest.fn()
    
    await auth(req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.status().send).toHaveBeenCalledWith({error: 'Authentication failed'})
    expect(next).not.toHaveBeenCalled()
  })

  test('Should fail with invalid token', async () => {
    const req = {
      header: jest.fn().mockReturnValue('Bearer invalidtoken')
    }
    const res = {
      status: jest.fn().mockReturnValue({
        send: jest.fn()
      })
    }
    const next = jest.fn()
    
    await auth(req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.status().send).toHaveBeenCalledWith({error: 'Authentication failed'})
    expect(next).not.toHaveBeenCalled()
  })

  test('Should fail with expired token', async () => {
    const expiredToken = jwt.sign({ _id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '0s' })
    
    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${expiredToken}`)
    }
    const res = {
      status: jest.fn().mockReturnValue({
        send: jest.fn()
      })
    }
    const next = jest.fn()
    
    await auth(req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.status().send).toHaveBeenCalledWith({error: 'Authentication failed'})
    expect(next).not.toHaveBeenCalled()
  })

  test('Should fail when user not found in database', async () => {
    await User.deleteMany()
    
    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${authToken}`)
    }
    const res = {
      status: jest.fn().mockReturnValue({
        send: jest.fn()
      })
    }
    const next = jest.fn()
    
    await auth(req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.status().send).toHaveBeenCalledWith({error: 'Authentication failed'})
    expect(next).not.toHaveBeenCalled()
  })

  test('Should fail when token not in user tokens array', async () => {
    testUser.tokens = []
    await testUser.save()
    
    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${authToken}`)
    }
    const res = {
      status: jest.fn().mockReturnValue({
        send: jest.fn()
      })
    }
    const next = jest.fn()
    
    await auth(req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.status().send).toHaveBeenCalledWith({error: 'Authentication failed'})
    expect(next).not.toHaveBeenCalled()
  })

  test('Should handle malformed Authorization header', async () => {
    const req = {
      header: jest.fn().mockReturnValue('InvalidFormat')
    }
    const res = {
      status: jest.fn().mockReturnValue({
        send: jest.fn()
      })
    }
    const next = jest.fn()
    
    await auth(req, res, next)
    
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.status().send).toHaveBeenCalledWith({error: 'Authentication failed'})
    expect(next).not.toHaveBeenCalled()
  })
})