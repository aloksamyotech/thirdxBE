import express from 'express'
import configRouter from './configuration.js'
import userRouter from './user.js'
import serviceRouter from './services.js'

const router = express.Router()

router.use('/config', configRouter)
router.use('/user', userRouter)
router.use('/services', serviceRouter)

export default router
