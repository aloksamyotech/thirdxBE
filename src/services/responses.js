import Response from '../models/response.js';

export const saveResponse = async (formId, body) => {
    
    const response = new Response({
        formId: formId,
        data: body
    });
    await response.save();
    return response
}
