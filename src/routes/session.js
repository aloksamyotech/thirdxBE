/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  addSession,
  deleteSession,
  searchSession,
  getSessionById,
  getAllSession,
  editSession,
  getAllWithPagination,
  archiveSession,
  unArchiveSession
} from '../controllers/session.js'
import { upload } from '../core/helpers/multer.js'

const router = Router()

router.post('/addSession', upload.single('file'), asyncHandler(addSession))
router.patch('/deleteSession/:id', asyncHandler(deleteSession))
router.get('/search', asyncHandler(searchSession))
router.get('/getSessionById/:id', asyncHandler(getSessionById))
router.get('/getAllSession', asyncHandler(getAllSession))
router.put('/editSession/:id', upload.single('file'), asyncHandler(editSession))
router.get('/allwithpagination', asyncHandler(getAllWithPagination))
router.put('/archive/:sessionId', asyncHandler(archiveSession))
router.put('/unArchive/:sessionId', asyncHandler(unArchiveSession))

export default router
