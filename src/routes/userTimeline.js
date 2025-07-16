import { Router } from 'express';
import { asyncHandler } from '../utils/asyncWrapper.js';
import { createEmailInbound, createEmailOutbound, createLetterReceived, createLetterSent, createPhoneCallInbound, createPhoneCallOutbound, createRegisterAttendance } from '../controllers/userTimeline.js';

const router = Router();

router.post('/register-attendance/:id', asyncHandler(createRegisterAttendance));
router.post('/email-inbound/:id', asyncHandler(createEmailInbound));
router.post('/email-outbound/:id', asyncHandler(createEmailOutbound));
router.post('/phone-inbound/:id', asyncHandler(createPhoneCallInbound));
router.post('/phone-outbound/:id', asyncHandler(createPhoneCallOutbound));
router.post('/letter-received/:id', asyncHandler(createLetterReceived));
router.post('/letter-sent/:id', asyncHandler(createLetterSent));


export default router