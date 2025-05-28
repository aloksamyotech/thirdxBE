import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  changePassword,
  editAdmin,
  getAdminById,
  loginAdmin,
  signUpAdmin,
} from '../controllers/admin.js'
const router = Router()

router.post('/', asyncHandler(signUpAdmin))
router.post('/login', asyncHandler(loginAdmin))
router.put('/:id', asyncHandler(editAdmin))
router.get('/:id', asyncHandler(getAdminById))
router.post('/changepass/:id', asyncHandler(changePassword))
export default router
