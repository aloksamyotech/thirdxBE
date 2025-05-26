import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
getAllDonationTotal,
getAllSessionDelivered,
getAllActiveServiceUser,
getAllOpenCased
} from '../controllers/dashboard.js'

const router = Router()

router.get('/totalDonantion', asyncHandler(getAllDonationTotal))
router.get('/totalSession', asyncHandler(getAllSessionDelivered))
router.get('/totalActiveUser', asyncHandler(getAllActiveServiceUser))
router.get('/totalOpenedCases', asyncHandler(getAllOpenCased))


export default router
