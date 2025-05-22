import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  addTags,
  filter,
  getAllTags,
  updateTagStatus,
  editTags,
  deleteTags,
  getTagwithPagination,
} from '../controllers/tag.js'

const router = Router()

router.post('/', asyncHandler(addTags))
router.get('/getalltag', asyncHandler(getAllTags));
// router.get('/filter', asyncHandler(filter))
router.put('/updateStatus/:tagId', asyncHandler(updateTagStatus));
router.put('/edit/:tagId', asyncHandler(editTags));

router.put('/delete/:tagId', asyncHandler(deleteTags))

router.get('/allwithpagination', asyncHandler(getTagwithPagination))

export default router
