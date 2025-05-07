import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addMail, filter, getAllMail } from '../controllers/mail.js'

const router = Router()

router.post(
    '/addmail',
    asyncHandler(addMail)
)
router.get(
    '/getallmail',
    asyncHandler(getAllMail)
)
router.get(
    '/filter',
    asyncHandler(filter)
)
export default router
