import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import {
getAllDonationTotal,
getAllSessionDelivered,
getAllActiveServiceUser,
getAllOpenCased,
addTask,
editTask,
getTaskById,
deleteTask
} from '../controllers/dashboard.js'

const router = Router()

router.get('/totalDonantion', asyncHandler(getAllDonationTotal))
router.get('/totalSession', asyncHandler(getAllSessionDelivered))
router.get('/totalActiveUser', asyncHandler(getAllActiveServiceUser))
router.get('/totalOpenedCases', asyncHandler(getAllOpenCased))

//Task Api
router.post('/createTask', asyncHandler(addTask));
router.put('/editTask/:id', asyncHandler(editTask))
router.get('/getTaskById/:id', asyncHandler(getTaskById))
router.patch('/delete/:id', asyncHandler(deleteTask))




export default router
