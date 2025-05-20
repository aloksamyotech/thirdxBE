import Response from '../models/response.js';

export const saveResponse = async (formId) => {
    const response = new Response({
        formId: formId,
        data: req.body
    });
    await response.save();
    return response
}
