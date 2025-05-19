/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
addCaseNote,
editCaseNote,
getAllCaseNote,
getCaseNoteById,
deleteCaseNote
} from '../controllers/caseNote.js'
import { upload } from '../core/helpers/multer.js'

const router = Router()

router.post('/addCaseNote',  upload.single('file'),asyncHandler(addCaseNote));
router.patch('/deleteCaseNote/:id', asyncHandler(deleteCaseNote))
router.get('/getCaseNoteById/:id', asyncHandler(getCaseNoteById))
router.get('/getAllCasesNote', asyncHandler(getAllCaseNote))
router.put('/editCaseNote/:caseNoteId', upload.single('file'), asyncHandler(editCaseNote));

export default router
