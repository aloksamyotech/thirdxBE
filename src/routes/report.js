import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  getUserServiceReport,
  getCaseContactReport,
  getSessionContactReport,
  getDonorReport,
} from '../controllers/report.js'
const router = Router()

router.get('/getreport_userservices', asyncHandler(getUserServiceReport))
router.get('/getreport_casecontact', asyncHandler(getCaseContactReport))
router.get('/getreport_sessioncontact', asyncHandler(getSessionContactReport))
router.get('/getreport_donor', asyncHandler(getDonorReport))
export default router
