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
        data: body,
        title: form?.title
    });
    await response.save();
    return response
}

export const getAllResponse = async (query) => {

    const { page = 1, limit = 10, search } = query || {}
    const skip = (page - 1) * limit;
    const searchQuery = search ? {
        title: { $regex: search, $options: 'i' }
    } : {};
    const getAllResponse = await Response
        .find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('formId')

    const total = await Response.countDocuments(searchQuery);

    return {
        data: getAllResponse,
        meta: {
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        }
    };
}

export const getResponseById = async (id) => {

    const response = await Response.findById(id).populate('formId');
    if (!response) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    return response
}

export const updateResponseStatus = async (id, status) => {

    const updateResponse = await Response.findByIdAndUpdate(id, { status })
    return updateResponse
}