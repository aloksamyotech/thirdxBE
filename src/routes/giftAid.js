import { Router } from 'express';
import { asyncHandler } from '../utils/asyncWrapper.js';
import { createGiftAid } from '../controllers/giftAid.js';

const router = Router();

router.post('/:id', asyncHandler(createGiftAid));

export default router