import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
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
export default router
