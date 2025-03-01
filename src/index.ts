import express from 'express'
import usersRouter from '~/routes/users.router'
import databaseServices from '~/services/database.services'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
const app = express()
const port = 4000
databaseServices.connect()

app.use(express.json())
app.use('/users', usersRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
