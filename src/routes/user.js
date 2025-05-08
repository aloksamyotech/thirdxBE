import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addUser, getAllDonor, getAllUser, getAllVolunteer, getUserById ,getAllUsDistricts} from '../controllers/user.js'

const router = Router()

router.post('/adduser', asyncHandler(addUser))
router.get('/getalluser', asyncHandler(getAllUser))
router.get('/getallvolunteer', asyncHandler(getAllVolunteer))
router.get('/getalldonor', asyncHandler(getAllDonor))
router.get('/getUserById/:userId', asyncHandler(getUserById))
router.get('/getAllUsDistricts', asyncHandler(getAllUsDistricts))


export default router
