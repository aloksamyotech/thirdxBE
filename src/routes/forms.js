import express from 'express';
import {
    addForm,
    getFormById,
    getAllForms
} from '../controllers/form.js';

const router = express.Router();

router.post('/', addForm);
router.get('/getallforms', getAllForms)
router.get('/:formId', getFormById);

export default router;
