import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  addServices,
  deleteServices,
  searchServices,
  getServiceById,
  getAllServices,
  editServices,
  getServiceswithPagination,
  toggleArchiveSession,
  deleteSession,
  bulkUpload,
} from '../controllers/services.js'
import { upload } from '../core/helpers/multer.js'

const router = Router()

router.post('/addServices', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'attachment', maxCount: 1 },
  ]), asyncHandler(addServices))
router.post('/deleteService/:id', asyncHandler(deleteServices))
router.get('/search', asyncHandler(searchServices))
router.get('/getServiceById/:id', asyncHandler(getServiceById))
router.get('/all', asyncHandler(getAllServices))
router.get('/allwithpagination', asyncHandler(getServiceswithPagination))
router.put('/editServices/:serviceId', upload.single('file'), asyncHandler(editServices))
router.post('/toggleArchive/:id', asyncHandler(toggleArchiveSession))
router.post('/delete/:id', asyncHandler(deleteSession))
router.post('/bulkUpload', asyncHandler(bulkUpload));

export default router
