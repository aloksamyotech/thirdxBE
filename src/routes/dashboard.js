import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
getAllDonationTotal
} from '../controllers/dashboard.js'

const router = Router()

router.get('/totalDonantion', asyncHandler(getAllDonationTotal))

export default router
