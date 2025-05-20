import Response from '../models/response.js';

export const saveResponse = async (req) => {
    const { formId } = req?.params
    const response = new Response({
        formId: formId,
        data: req.body
    });
    await response.save();
    return response
}
