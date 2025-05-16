/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  addCase,
  deleteCase,
  searchCase,
  getCaseById,
  getAllCases,
  editCase
} from '../controllers/case.js'
import { upload } from '../core/helpers/multer.js'

const router = Router()

router.post('/addCase', upload.single('file'), asyncHandler(addCase));
router.patch('/deleteCase/:id', asyncHandler(deleteCase))
router.get('/search', asyncHandler(searchCase))
router.get('/getCaseById/:id', asyncHandler(getCaseById))
router.get('/getAllCases', asyncHandler(getAllCases))
router.put('/editCase/:caseId', upload.single('file'), asyncHandler(editCase));

export default router
