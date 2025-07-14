import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addTagCategory, getTagCategorywithPagination, updateTagStatus, getbyId, editTagCategory } from '../controllers/tagCategory.js'

const router = Router()

router.post('/', asyncHandler(addTagCategory));
router.get('/allwithpagination', asyncHandler(getTagCategorywithPagination));
router.get('/:id', asyncHandler(getbyId));
router.put('/updateStatus/:tagId', asyncHandler(updateTagStatus));
router.put('/edit/:id', asyncHandler(editTagCategory));
export default router