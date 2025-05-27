import express from 'express';
import {
    getAllResponse,
    getResponseById,
    saveResponse
} from '../controllers/responses.js';
import { asyncHandler } from '../utils/asyncWrapper.js';

const router = express.Router();

router.get('/', asyncHandler(getAllResponse))
router.get('/responsebyid/:id', asyncHandler(getResponseById))
router.post('/:formId', asyncHandler(saveResponse));

export default router;
