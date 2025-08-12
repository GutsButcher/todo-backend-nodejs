const User = require('../../src/models/user')
const jwt = require('jsonwebtoken')

beforeEach(async () => {
  await User.deleteMany()
})

describe('User Model Tests', () => {
  test('Should create a new user with valid data', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'MyPass777!',
      age: 25
    }
    
    const user = new User(userData)
    await user.save()
    
    expect(user._id).toBeDefined()
    expect(user.name).toBe(userData.name)
    expect(user.email).toBe(userData.email)
    expect(user.age).toBe(userData.age)
    expect(user.password).not.toBe(userData.password)
    expect(user.tokens).toEqual([])
  })

  test('Should not create user without required fields', async () => {
    const user = new User({})
    
    await expect(user.save()).rejects.toThrow()
  })

  test('Should not create user with invalid email', async () => {
    const user = new User({
      name: 'Test User',
      email: 'invalidemail',
      password: 'MyPass777!'
    })
    
    await expect(user.save()).rejects.toThrow()
  })

  test('Should not create user with password containing "password"', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })
    
    await expect(user.save()).rejects.toThrow('Your password can not contain the word password!')
  })

  test('Should not create user with password less than 7 characters', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    })
    
    await expect(user.save()).rejects.toThrow()
  })

  test('Should not create user with negative age', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'MyPass777!',
      age: -5
    })
    
    await expect(user.save()).rejects.toThrow('Age must be a positive number')
  })

  test('Should hash password before saving', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'MyPass777!'
    }
    
    const user = new User(userData)
    await user.save()
    
    expect(user.password).not.toBe(userData.password)
    expect(user.password.length).toBeGreaterThan(userData.password.length)
  })

  test('Should generate auth token', async () => {
    process.env.JWT_SECRET = 'testsecret'
    
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'MyPass777!'
    })
    await user.save()
    
    const token = await user.generateAuthToken()
    
    expect(token).toBeDefined()
    expect(user.tokens.length).toBe(1)
    expect(user.tokens[0].token).toBe(token)
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    expect(decoded._id).toBe(user._id.toString())
  })

  test('Should find user by credentials', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'MyPass777!'
    }
    
    const user = new User(userData)
    await user.save()
    
    const foundUser = await User.findByCredentials(userData.email, userData.password)
    
    expect(foundUser).toBeDefined()
    expect(foundUser._id.toString()).toBe(user._id.toString())
  })

  test('Should not find user with wrong password', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'MyPass777!'
    }
    
    const user = new User(userData)
    await user.save()
    
    await expect(User.findByCredentials(userData.email, 'wrongpassword')).rejects.toThrow('Unable to login.')
  })

  test('Should not find non-existent user', async () => {
    await expect(User.findByCredentials('nonexistent@example.com', 'somepassword')).rejects.toThrow()
  })

  test('Should remove password and tokens from JSON output', () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'MyPass777!',
      tokens: [{ token: 'sometoken' }]
    })
    
    const userObject = user.toJSON()
    
    expect(userObject.password).toBeUndefined()
    expect(userObject.tokens).toBeUndefined()
    expect(userObject.name).toBe('Test User')
    expect(userObject.email).toBe('test@example.com')
  })
})