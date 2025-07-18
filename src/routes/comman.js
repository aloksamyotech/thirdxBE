import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { findTagWithCategory } from '../controllers/comman.js'

const router = Router()

router.get('/', asyncHandler(findTagWithCategory))


export default router
