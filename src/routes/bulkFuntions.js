import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { bulkSoftArchive, bulkSoftDelete } from '../controllers/bulkFuntions.js'

const router = Router()

router.put('/delete', asyncHandler(bulkSoftDelete))
router.put('/archive', asyncHandler(bulkSoftArchive))


export default router
