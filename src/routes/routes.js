import express from 'express'
import configRouter from './configuration.js'
import userRouter from './user.js'
import serviceRouter from './services.js'
import mailRouter from './mail.js'
import caseRouter from './case.js'

const router = express.Router()

router.use('/config', configRouter)
router.use('/user', userRouter)
router.use('/services', serviceRouter)
router.use('/mail', mailRouter)
router.use('/cases', caseRouter)


export default router
