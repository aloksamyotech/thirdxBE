import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addUser, getAllUser, getUserById } from '../controllers/user.js'

const router = Router()

router.post('/adduser', asyncHandler(addUser))
router.get('/getalluser', asyncHandler(getAllUser))
router.get('/getUserById/:userId', asyncHandler(getUserById))

export default router
