import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addTags, filter, getAllTags, updateTagStatus, editTags, deleteTags } from '../controllers/tag.js'

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
router.put(
    '/editTag/:tagId',
    asyncHandler(editTags)
)

router.put(
    '/deleteTag/:tagId',
    asyncHandler(deleteTags)
)

export default router
