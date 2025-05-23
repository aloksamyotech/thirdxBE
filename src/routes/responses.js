import express from 'express';
import {
    getAllResponse,
    saveResponse
} from '../controllers/responses.js';
import { asyncHandler } from '../utils/asyncWrapper.js';

const router = express.Router();

router.get('/', asyncHandler(getAllResponse))
router.post('/:formId', asyncHandler(saveResponse));

export default router;
