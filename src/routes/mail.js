import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addMail, filter, getAllMail, editMail, deleteMail } from '../controllers/mail.js'

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
router.put(
    '/editmail/:mailId',
    asyncHandler(editMail)
)

router.put('/deletemail/:mailId', asyncHandler(deleteMail));

export default router
