import express, { Request, Response, NextFunction } from 'express'
import router from './routes/users.route'
import DatabaseService from '~/services/database.services'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('helo')
})
app.use(express.json())
app.use('/api', router)

DatabaseService.connect()
app.use((req: Request, res: Response, err: any, next: NextFunction) => {
  res.status(400).json({ error: err.message })
})
app.listen(port, () => {
  console.log('running in port 3000')
})
