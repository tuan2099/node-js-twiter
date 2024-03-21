import express from 'express'
const router = express.Router()

router.use((req, res, next) => {
  console.log('Time')
  next()
})

router.get('/tweets', (req, res) => {
  res.json({ data: [{ id: 1, name: 'Hoàng Anh Tuấn' }] })
})

export default router
