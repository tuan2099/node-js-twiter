import express from 'express'
import router from './routes/users.route'
import { run } from '~/services/database.services'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('helo')
})
app.use(express.json())
app.use('/api', router)

run().catch(console.dir)

app.listen(port, () => {
  console.log('running in port 3000')
})
