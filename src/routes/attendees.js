import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addAttendees, getAllAttendees, getAttendees,getattendeeBySession } from '../controllers/attendees.js'

const router = Router()


router.post('/addAttendee', asyncHandler(addAttendees))
router.get('/getall', asyncHandler(getAllAttendees))
router.get('/getwithpagination', asyncHandler(getAttendees))
router.get('/getattendeeBySession/:sessionId', asyncHandler(getattendeeBySession))




export default router
