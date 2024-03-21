import express from 'express'
import router from './user.route'
const app = express()
const port = 3000

// middleware

app.get('/', (req, res) => {
  res.send('helo')
})
app.use('/api', router)
app.listen(port, () => {
  console.log('running in port 3000')
})
