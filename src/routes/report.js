import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  getUserServiceReport,
  getCaseContactReport,
  getSessionContactReport,
  getDonorReport,
} from '../controllers/report.js'
const router = Router()

router.get('/userservices', asyncHandler(getUserServiceReport))
router.get('/cases', asyncHandler(getCaseContactReport))
router.get('/sessions', asyncHandler(getSessionContactReport))
router.get('/donor', asyncHandler(getDonorReport))
export default router
