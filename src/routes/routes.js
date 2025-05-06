import express from 'express'
import configRouter from './configuration.js'
import userRouter from './user.js'

const router = express.Router()

router.use('/config', configRouter)
router.use('/user', userRouter)


export default router
