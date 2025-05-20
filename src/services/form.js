import Form from '../models/form.js';

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
                values: f.values
            }
        })

    const form = new Form({
        title: setTitle,
        template: 'default',
        fields: formatfields
    });
    await form.save();

    return form
}

export const getFormById = async (formId) => {
    const form = await Form.findById({ _id: formId });
    if (!form) return res.status(404).json({ error: 'Form not found' });
    return form
}

export const getAllForms = async () => {
    const form = await Form
        .find()
        .sort({ createdAt: -1 });
    return form
}