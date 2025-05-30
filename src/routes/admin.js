import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  changePassword,
  editAdmin,
  getAdminById,
  googleSignin,
  loginAdmin,
  signUpAdmin,
  getAllAdmins,
} from '../controllers/admin.js'
import { userAuth } from '../middlewares/userAuth.js'
import { upload } from '../core/helpers/multer.js'
const router = Router()

router.post('/', asyncHandler(signUpAdmin))
router.post('/login', asyncHandler(loginAdmin))
router.post('/google-auth', asyncHandler(googleSignin))
router.put(
  '/',
  asyncHandler(userAuth),
  upload.single('file'),
  asyncHandler(editAdmin)
)
router.get('/', asyncHandler(userAuth), asyncHandler(getAdminById))
router.patch(
  '/change-password',
  asyncHandler(userAuth),
  asyncHandler(changePassword)
)
router.get('/getAllAdmin', asyncHandler(userAuth), asyncHandler(getAllAdmins))
export default router
