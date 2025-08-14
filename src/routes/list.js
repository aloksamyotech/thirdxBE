import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addList, getAllList, getListDetailById, getListWithPagination,AddBulkTagController } from '../controllers/list.js'


const router = Router()

router.post('/addList', asyncHandler(addList))
router.get('/getallList', asyncHandler(getAllList))
router.get('/allwithpagination', asyncHandler(getListWithPagination))
router.get('/getList/:id', asyncHandler(getListDetailById))
router.post('/addBulkTags', asyncHandler(AddBulkTagController))
export default router
