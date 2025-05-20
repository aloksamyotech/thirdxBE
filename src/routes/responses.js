import express from 'express';
import {
    saveResponse
} from '../controllers/responses.js';

const router = express.Router();

router.post('/:formId', saveResponse);

export default router;
