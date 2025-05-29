import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  changePassword,
  editAdmin,
  getAdminById,
  loginAdmin,
  signUpAdmin,
} from '../controllers/admin.js'
import { userAuth } from '../middlewares/userAuth.js'
import { upload } from '../core/helpers/multer.js'
const router = Router()

router.post('/', asyncHandler(signUpAdmin))
router.post('/login', asyncHandler(loginAdmin))
router.put('/updateUserById', asyncHandler(userAuth), upload.single('file'), asyncHandler(editAdmin))
router.get('/getUserById', asyncHandler(userAuth), asyncHandler(getAdminById))
export default router
