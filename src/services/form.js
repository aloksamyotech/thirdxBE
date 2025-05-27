import Form from '../models/form.js';
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

export const addForm = async (fields) => {
    let setTitle
    const formatfields = fields
        .map((f, index) => {
            if (f.type === 'header') {
                setTitle = f.label
            }
            return {
                id: index + 1,
                name: f.name || '',
                label: f.label || '',
                type: f.type || '',
                required: f.required || false,
                values: f.values,
                validation: f.validation || ''
            }
        })

    const formCount = await Form.countDocuments();
    const publicId = `surveyform-${10000 + formCount + 1}`;

    const form = new Form({
        title: setTitle,
        template: 'default',
        fields: formatfields,
        publicId
    });
    await form.save();

    return form
}

export const getFormById = async (formId) => {
    const form = await Form.findOne({ publicId: formId });
    if (!form) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    return form
}

export const getAllForms = async () => {
    const form = await Form
        .find()
        .sort({ createdAt: -1 });
    return form
}