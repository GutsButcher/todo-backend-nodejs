const request = require('supertest')
const app = require('../../src/app')
const Task = require('../../src/models/task')
const { 
  userOneId, 
  userOne, 
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase 
} = require('../fixtures/db')

beforeEach(setupDatabase)

describe('Task Routes Integration Tests', () => {
  test('Should create task for user', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        description: 'From my test'
      })
      .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
  })

  test('Should not create task with invalid description', async () => {
    await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        description: ''
      })
      .expect(400)
  })

  test('Should not create task for unauthenticated user', async () => {
    await request(app)
      .post('/tasks')
      .send({
        description: 'From my test'
      })
      .expect(401)
  })

  test('Should fetch user tasks', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
    
    expect(response.body.length).toBe(2)
  })

  test('Should fetch only completed tasks', async () => {
    const response = await request(app)
      .get('/tasks?completed=true')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
    
    expect(response.body.length).toBe(1)
    expect(response.body[0].completed).toBe(true)
  })

  test('Should fetch only incomplete tasks', async () => {
    const response = await request(app)
      .get('/tasks?completed=false')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
    
    expect(response.body.length).toBe(1)
    expect(response.body[0].completed).toBe(false)
  })

  test('Should sort tasks by description', async () => {
    const response = await request(app)
      .get('/tasks?sortBy=description:desc')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
    
    expect(response.body[0].description).toBe('Second task')
    expect(response.body[1].description).toBe('First task')
  })

  test('Should fetch page of tasks', async () => {
    const response = await request(app)
      .get('/tasks?limit=1&skip=1')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
    
    expect(response.body.length).toBe(1)
  })

  test('Should fetch user task by id', async () => {
    const response = await request(app)
      .get(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
    
    expect(response.body.description).toBe('First task')
  })

  test('Should not fetch user task by id if unauthenticated', async () => {
    await request(app)
      .get(`/tasks/${taskOne._id}`)
      .send()
      .expect(401)
  })

  test('Should not fetch other users task by id', async () => {
    await request(app)
      .get(`/tasks/${taskThree._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(404)
  })

  test('Should update task', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        completed: true
      })
      .expect(200)
    
    const task = await Task.findById(taskOne._id)
    expect(task.completed).toBe(true)
  })

  test('Should not update task with invalid updates', async () => {
    await request(app)
      .patch(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        location: 'New York'
      })
      .expect(400)
  })

  test('Should not update other users task', async () => {
    await request(app)
      .patch(`/tasks/${taskThree._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        completed: true
      })
      .expect(404)
  })

  test('Should delete user task', async () => {
    await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
    
    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()
  })

  test('Should not delete other users tasks', async () => {
    await request(app)
      .delete(`/tasks/${taskThree._id}`)
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(404)
    
    const task = await Task.findById(taskThree._id)
    expect(task).not.toBeNull()
  })

  test('Should not delete task if unauthenticated', async () => {
    await request(app)
      .delete(`/tasks/${taskOne._id}`)
      .send()
      .expect(401)
  })
})