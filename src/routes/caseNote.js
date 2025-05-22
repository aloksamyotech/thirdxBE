/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  addCaseNote,
  editCaseNote,
  getCaseNoteById,
  deleteCaseNote,
  getAllCaseNote,
  getAllWithPagination,
} from '../controllers/caseNote.js'
import { upload } from '../core/helpers/multer.js'

const router = Router()

router.post('/add', upload.single('file'), asyncHandler(addCaseNote))
router.patch('/delete/:id', asyncHandler(deleteCaseNote))
router.get('/getById/:id', asyncHandler(getCaseNoteById))
router.get('/getAll', asyncHandler(getAllCaseNote))
router.get('/getAllWithPagination', asyncHandler(getAllWithPagination))
router.put(
  '/edit/:caseNoteId',
  upload.single('file'),
  asyncHandler(editCaseNote)
)

export default router
