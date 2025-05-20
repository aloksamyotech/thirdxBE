import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  addUser,
  getAllDonor,
  getAllVolunteer,
  getUserById,
  getAllUsDistricts,
  editUser,
  deleteUser,
  editArchiveVolunteer,
  getAllServiceUser,
  getAllUsers,
  getUserwithPagination,
  archiveUser
} from '../controllers/user.js'
import { upload } from '../core/helpers/multer.js'

const router = Router()

router.post('/adduser', upload.single('file'), asyncHandler(addUser))
router.get('/getallServiceUser', asyncHandler(getAllServiceUser))
router.get('/getalluser', asyncHandler(getAllUsers))
router.get('/getallvolunteer', asyncHandler(getAllVolunteer))
router.get('/getalldonor', asyncHandler(getAllDonor))
router.get('/getUserById/:userId', asyncHandler(getUserById))
router.get('/getAllUsDistricts', asyncHandler(getAllUsDistricts))
router.post('/edituser/:userId', upload.single('file'), asyncHandler(editUser))
router.put('/deleteuser/:userId', asyncHandler(deleteUser))
router.put('/editArchiveVolunteer/:userId', asyncHandler(editArchiveVolunteer))
router.put('/archive/:userId', asyncHandler(archiveUser))
router.get('/allwithpagination', asyncHandler(getUserwithPagination))

export default router
