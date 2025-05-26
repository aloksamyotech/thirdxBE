import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { loginAdmin, signUpAdmin } from '../controllers/admin.js'
const router = Router()

router.post('/', asyncHandler(signUpAdmin))
router.post('/login', asyncHandler(loginAdmin))

export default router
    