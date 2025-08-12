const Task = require('../../src/models/task')
const User = require('../../src/models/user')

let testUser

beforeEach(async () => {
  await Task.deleteMany()
  await User.deleteMany()
  
  testUser = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'MyPass777!'
  })
  await testUser.save()
})

describe('Task Model Tests', () => {
  test('Should create a new task with valid data', async () => {
    const taskData = {
      description: 'Test task',
      completed: true,
      author: testUser._id
    }
    
    const task = new Task(taskData)
    await task.save()
    
    expect(task._id).toBeDefined()
    expect(task.description).toBe(taskData.description)
    expect(task.completed).toBe(taskData.completed)
    expect(task.author.toString()).toBe(testUser._id.toString())
    expect(task.createdAt).toBeDefined()
    expect(task.updatedAt).toBeDefined()
  })

  test('Should create task with default completed value', async () => {
    const task = new Task({
      description: 'Test task',
      author: testUser._id
    })
    await task.save()
    
    expect(task.completed).toBe(false)
  })

  test('Should not create task without description', async () => {
    const task = new Task({
      author: testUser._id
    })
    
    await expect(task.save()).rejects.toThrow()
  })

  test('Should not create task without author', async () => {
    const task = new Task({
      description: 'Test task'
    })
    
    await expect(task.save()).rejects.toThrow()
  })

  test('Should trim task description', async () => {
    const task = new Task({
      description: '  Test task with spaces  ',
      author: testUser._id
    })
    await task.save()
    
    expect(task.description).toBe('Test task with spaces')
  })

  test('Should populate author field', async () => {
    const task = new Task({
      description: 'Test task',
      author: testUser._id
    })
    await task.save()
    
    await task.populate('author').execPopulate()
    
    expect(task.author.name).toBe('Test User')
    expect(task.author.email).toBe('test@example.com')
  })

  test('Should have timestamps', async () => {
    const task = new Task({
      description: 'Test task',
      author: testUser._id
    })
    await task.save()
    
    expect(task.createdAt).toBeInstanceOf(Date)
    expect(task.updatedAt).toBeInstanceOf(Date)
  })

  test('Should update updatedAt on modification', async (done) => {
    const task = new Task({
      description: 'Test task',
      author: testUser._id
    })
    await task.save()
    
    const originalUpdatedAt = task.updatedAt
    
    setTimeout(async () => {
      task.completed = true
      await task.save()
      
      expect(task.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
      done()
    }, 100)
  })
})