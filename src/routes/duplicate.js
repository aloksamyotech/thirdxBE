import express from 'express';
import {
    getDuplicateUserPairs
} from '../controllers/duplicate.js';
import { asyncHandler } from '../utils/asyncWrapper.js';

const router = express.Router();

router.get('/getallduplicate', asyncHandler(getDuplicateUserPairs))

export default router;
