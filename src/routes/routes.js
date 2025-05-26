import express from 'express'
import configRouter from './configuration.js'
import userRouter from './user.js'
import serviceRouter from './services.js'
import mailRouter from './mail.js'
import tagRouter from './tag.js'
import transactionRouter from './transaction.js'
import caseRouter from './case.js'
import sessionRouter from './session.js'
import caseNoteRouter from './caseNote.js';
import attendeesRouter from './attendees.js'
import dashboardRoute from './dashboard.js'
const router = express.Router()

router.use('/config', configRouter)
router.use('/user', userRouter)
router.use('/services', serviceRouter)
router.use('/mail', mailRouter)
router.use('/tag', tagRouter)
router.use('/transaction', transactionRouter)
router.use('/cases', caseRouter)
router.use('/session', sessionRouter)
router.use('/caseNote', caseNoteRouter)
router.use('/attendees',attendeesRouter) 
router.use('/dashboard',dashboardRoute)

export default router
