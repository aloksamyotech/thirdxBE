import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addUser, getAllUser, getUserById,getAllUsDistricts } from '../controllers/user.js'

const router = Router()

router.post('/adduser', asyncHandler(addUser))
router.get('/getalluser', asyncHandler(getAllUser))
router.get('/getUserById/:userId', asyncHandler(getUserById))
router.get('/getAllUsDistricts', asyncHandler(getAllUsDistricts))


export default router
