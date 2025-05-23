import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { signUpAdmin } from '../controllers/admin.js'
const router = Router()

router.post('/', asyncHandler(signUpAdmin))
export default router