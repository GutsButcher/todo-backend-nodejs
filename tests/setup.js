const mongoose = require('mongoose')

beforeAll(async () => {
  const url = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/task-manager-test'
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
})

afterAll(async () => {
  await mongoose.disconnect()
})