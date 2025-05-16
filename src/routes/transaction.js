import { Router } from 'express'
import { asyncHandler } from '../utils/asyncWrapper.js'
import { addTransaction, editTransaction, filter, getAllTransaction, editTransaction, deleteTransaction } from '../controllers/transaction.js'

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
router.put(
    '/edit_transaction/:id',
    asyncHandler(editTransaction)
)
router.put(
    '/delete_transaction/:id',
    asyncHandler(deleteTransaction)
)
export default router
