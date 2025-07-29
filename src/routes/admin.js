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
  forgotPassword,
  verifyOtp,
  resetPassword,
  createConfigUser,
  deleteAdmin,
  getUserWithPagination
} from '../controllers/admin.js'
import { userAuth } from '../middlewares/userAuth.js'
import { upload } from '../core/helpers/multer.js'
const router = Router()

router.post('/', asyncHandler(signUpAdmin))
router.post('/create-user', asyncHandler(createConfigUser))
router.post('/login', asyncHandler(loginAdmin))
router.post('/google-auth', asyncHandler(googleSignin))
router.put(
  '/:adminId',
  asyncHandler(userAuth),
  upload.single('file'),
  asyncHandler(editAdmin)
);
router.patch('/delete/:adminId', asyncHandler(deleteAdmin));
router.get('/allwithpagination', asyncHandler(getUserWithPagination))
router.get('/', asyncHandler(userAuth), asyncHandler(getAdminById))
router.patch(
  '/change-password',
  asyncHandler(userAuth),
  asyncHandler(changePassword)
)
router.get('/getAllAdmin', asyncHandler(userAuth), asyncHandler(getAllAdmins))
router.post('/forgot-password', asyncHandler(forgotPassword))
router.post('/verify-otp', asyncHandler(verifyOtp))
router.post('/reset-password', asyncHandler(resetPassword))
export default router
