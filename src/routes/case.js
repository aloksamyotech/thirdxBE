import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  addCase,
  deleteCase,
  searchCase,
  getCaseById,
  getAllCases,
  editCase,
  getCasewithPagination,
  toggleArchiveCase,
  bulkUpload,
  getCasesByServiceUserId,
} from '../controllers/case.js'
import { upload } from '../core/helpers/multer.js'

const router = Router()

router.post('/addCase', upload.single('file'), asyncHandler(addCase))
router.post('/deleteCase/:id', asyncHandler(deleteCase))
router.get('/search', asyncHandler(searchCase))
router.get('/getCaseById/:id', asyncHandler(getCaseById))
router.get('/getCaseServiceUser/:id', asyncHandler(getCasesByServiceUserId))
router.get('/getAllCases', asyncHandler(getAllCases))
router.put('/editCase/:caseId', upload.single('file'), asyncHandler(editCase))
router.get('/allwithpagination', asyncHandler(getCasewithPagination))
router.post('/toggleArchive/:id', asyncHandler(toggleArchiveCase));
router.post('/bulkUpload', asyncHandler(bulkUpload));

export default router
