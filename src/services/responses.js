import Response from '../models/response.js';
import Form from '../models/form.js';
import CustomError from '../utils/exception.js';
import { errorCodes, Message, statusCodes } from '../core/common/constant.js';

export const saveResponse = async (formId, body) => {

    const form = await Form.findOne({ publicId: formId })
    if (!form) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    const response = new Response({
        formId: form._id,
        data: body
    });
    await response.save();
    return response
}

export const getAllResponse = async () => {
    const getAllResponse = Response
        .find()
        .sort({ createdAt: -1 })
        .populate('formId')
    return getAllResponse
}
