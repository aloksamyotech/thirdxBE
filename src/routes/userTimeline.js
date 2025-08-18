import { Router } from 'express';
import { asyncHandler } from '../utils/asyncWrapper.js';
import { createEmailInbound, createEmailOutbound, createLetterReceived, createLetterSent, createPhoneCallInbound, createPhoneCallOutbound, createRegisterAttendance, createRegisterTask, getTimeLineData } from '../controllers/userTimeline.js';

const router = Router();

router.get('/:id', asyncHandler(getTimeLineData));
router.post('/register-attendance/:id', asyncHandler(createRegisterAttendance));
router.post('/register-task/:id', asyncHandler(createRegisterTask));
router.post('/email-inbound/:id', asyncHandler(createEmailInbound));
router.post('/email-outbound/:id', asyncHandler(createEmailOutbound));
router.post('/phone-inbound/:id', asyncHandler(createPhoneCallInbound));
router.post('/phone-outbound/:id', asyncHandler(createPhoneCallOutbound));
router.post('/letter-received/:id', asyncHandler(createLetterReceived));
router.post('/letter-sent/:id', asyncHandler(createLetterSent));


export default router