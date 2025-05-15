import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
  addConfiguration,
  deleteConfiguration,
  filter,
  getAllConfiguration,
  searchConfigurationName,
  updateConfigurationStatus,
  updatedConfiguration
} from '../controllers/configuration.js'

const router = Router()
router.put('/updateConfigurationData/:configId',asyncHandler(updatedConfiguration));
router.post('/addconfiguration', asyncHandler(addConfiguration))
router.get('/getallconfiguration', asyncHandler(getAllConfiguration))
router.put(
  '/updateconfigurationstatus/:configId',
  asyncHandler(updateConfigurationStatus)
)
router.put('/deleteconfiguration/:configId', asyncHandler(deleteConfiguration))
router.get('/searchconfigurationbyname', asyncHandler(searchConfigurationName))
router.get(
  '/filter',
  asyncHandler(filter)
)

export default router
