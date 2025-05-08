import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addTransaction, filter, getAllTransaction } from '../controllers/transaction.js'

const router = Router()

router.post(
    '/addtransaction',
    asyncHandler(addTransaction)
)
router.get(
    '/getalltransaction',
    asyncHandler(getAllTransaction)
)
router.get(
    '/filter',
    asyncHandler(filter)
)
export default router
