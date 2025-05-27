import express from 'express'
import configRouter from './configuration.js'
import userRouter from './user.js'
import serviceRouter from './services.js'
import mailRouter from './mail.js'
import tagRouter from './tag.js'
import transactionRouter from './transaction.js'
import caseRouter from './case.js'
import sessionRouter from './session.js'
import caseNoteRouter from './caseNote.js'
import attendeesRouter from './attendees.js'
import dashboardRoute from './dashboard.js'
import admin from './admin.js'
import { userAuth } from '../middlewares/userAuth.js'
import { asyncHandler } from '../utils/asyncWrapper.js'

const router = express.Router()

router.use('/admin', admin)
router.use('/config', asyncHandler(userAuth), configRouter)
router.use('/user', asyncHandler(userAuth), userRouter)
router.use('/services', asyncHandler(userAuth), serviceRouter)
router.use('/mail', asyncHandler(userAuth), mailRouter)
router.use('/tag', asyncHandler(userAuth), tagRouter)
router.use('/transaction', asyncHandler(userAuth), transactionRouter)
router.use('/cases', asyncHandler(userAuth), caseRouter)
router.use('/session', asyncHandler(userAuth), sessionRouter)
router.use('/caseNote', asyncHandler(userAuth), caseNoteRouter)
router.use('/attendees', asyncHandler(userAuth), attendeesRouter)
router.use('/dashboard', asyncHandler(userAuth), dashboardRoute)

export default router
