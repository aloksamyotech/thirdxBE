import Form from '../models/form.js';
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

export const addForm = async (fields) => {
    let setTitle
    const formatfields = fields?.formDataUpdated
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
        title: setTitle || '',
        type: fields?.formValues?.formType || '',
        description: fields?.formValues?.description || '',
        fields: formatfields,
        publicId,
        records: fields?.formValues?.formRecord || ''
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

export const getAllForms = async (query) => {

    const { page = 1, limit = 10, search } = query || {}
    const skip = (page - 1) * limit;
    const searchQuery = search ? {
        title: { $regex: search, $options: 'i' }
    } : {};

    const form = await Form
        .find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Form.countDocuments(searchQuery);
    return {
        data: form,
        meta: {
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        }
    };
}