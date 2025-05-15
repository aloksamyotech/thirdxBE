/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  addServices,
  deleteServices,
  searchServices,
  getServiceById,
  getAllServices,
} from '../controllers/services.js'
import { upload } from '../core/helpers/multer.js'

const router = Router()

router.post('/addServices', upload.single('file'), asyncHandler(addServices))
router.patch('/deleteService/:id', asyncHandler(deleteServices))
router.get('/search', asyncHandler(searchServices))
router.get('/getServiceById/:id', asyncHandler(getServiceById))
router.get('/getAllServices', asyncHandler(getAllServices))

export default router
