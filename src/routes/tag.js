import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addTags, filter, getAllTags, updateTagStatus } from '../controllers/tag.js'

const router = Router()

router.post(
    '/addtag',
    asyncHandler(addTags)
)
router.get(
    '/getalltag',
    asyncHandler(getAllTags)
)
router.get(
    '/filter',
    asyncHandler(filter)
)
router.put(
    '/updateTagStatus/:tagId',
    asyncHandler(updateTagStatus)
)

export default router
