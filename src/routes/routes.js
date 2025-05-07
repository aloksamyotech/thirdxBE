import express from 'express'
import configRouter from './configuration.js'
import userRouter from './user.js'
import mailRouter from './mail.js'

const router = express.Router()

router.use('/config', configRouter)
router.use('/user', userRouter)
router.use('/mail', mailRouter)

export default router
