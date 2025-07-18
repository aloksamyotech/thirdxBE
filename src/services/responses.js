import Response from '../models/response.js';
import Form from '../models/form.js';
import CustomError from '../utils/exception.js';
import { errorCodes, Message, statusCodes } from '../core/common/constant.js';
import user from '../models/user.js';
import { generateCustomId } from '../utils/generateCustomId.js';

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

    const { page = 1, limit = 10, search, date, status } = query || {}
    const skip = (page - 1) * limit;
    const searchQuery = search ? {
        title: { $regex: search, $options: 'i' }
    } : {};

    const filter = {
        ...searchQuery,
        ...(date !== undefined &&
            date !== '' && {
            submittedAt: {
                $gte: new Date(date),
                $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
            },
        }),
        ...(status !== undefined &&
            status !== '' && {
            status
        })
    }

    const getAllResponse = await Response
        .find(filter)
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

    const updateResponse = await Response.findByIdAndUpdate(id, { status }, { new: true })
    const formData = await Form.findById(updateResponse?.formId)
    if (formData?.records === "volunteer" || formData?.records === "service_user") {
        const uniqueId = await generateCustomId()
        const newVolunteer = await user.create({
            "uniqueId": uniqueId,
            "personalInfo": {
                "firstName": updateResponse?.data?.['First Name'],
                "lastName": updateResponse?.data?.['Last Name'],
                "ethnicity": updateResponse?.data?.['ethicity'],
                "dateOfBirth": updateResponse?.data?.['Date Of Birth'],
            },
            "contactInfo": {
                "phone": updateResponse?.data?.['Contact Number'],
                "email": updateResponse?.data?.['Email'],
                "addressLine1": updateResponse?.data?.['Address'],
            },
            "role": formData?.records,
            "isArchive": false,
            "isDelete": false,
            "isCompletlyDelete": false,
            "archive": false,
        }
        )
    }
    if (formData?.records === "donar_individual" || formData?.records === "donar_company" || formData?.records === "donar_group") {
        const uniqueId = await generateCustomId()
        const newVolunteer = await user.create({
            "uniqueId": uniqueId,
            "personalInfo": {
                "firstName": updateResponse?.data?.['First Name'],
                "lastName": updateResponse?.data?.['Last Name'],
                "ethnicity": updateResponse?.data?.['ethicity'],
                "dateOfBirth": updateResponse?.data?.['Date Of Birth'],
            },
            "contactInfo": {
                "phone": updateResponse?.data?.['Contact Number'],
                "email": updateResponse?.data?.['Email'],
                "addressLine1": updateResponse?.data?.['Address'],
            },
            "role": 'donor',
            "subRole": formData?.records,
            "isArchive": false,
            "isDelete": false,
            "isCompletlyDelete": false,
            "archive": false,
        }
        )
    }
    return updateResponse
}