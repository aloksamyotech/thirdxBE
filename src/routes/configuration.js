import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addConfiguration, deleteConfiguration, filterByConfigurationType, getAllConfiguration, searchConfigurationName, updateConfigurationStatus } from '../controllers/configuration.js'

const router = Router()

router.post(
    '/addconfiguration',
    asyncHandler(addConfiguration)
)
router.get(
    '/getallconfiguration',
    asyncHandler(getAllConfiguration)
)
router.put(
    '/updateconfigurationstatus/:configId',
    asyncHandler(updateConfigurationStatus)
)
router.put(
    '/deleteconfiguration/:configId',
    asyncHandler(deleteConfiguration)
)
router.get(
    '/searchconfigurationbyname',
    asyncHandler(searchConfigurationName)
)
router.get(
    '/filterbyconfigurationtype',
    asyncHandler(filterByConfigurationType)
)

export default router
