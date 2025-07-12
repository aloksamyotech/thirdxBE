import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import tagCategory from '../models/tagCategory.js'
import { regexFilter } from '../core/common/common.js'

export const addTagCategory = async (data) => {
    const newTagCategory = await tagCategory.create(data)
    if (!newTagCategory) {
        return new CustomError(
            statusCodes?.badRequest,
            Message?.notCreated,
            errorCodes?.bad_request
        )
    }
    return { newTagCategory }
}

export const updateTagStatus = async (tagId, isActive) => {
    const checkExist = await tagCategory.findById(tagId)

    if (!checkExist) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    const statusUpdate = await tagCategory.findByIdAndUpdate(
        tagId,
        { isActive },
        { new: true }
    )

    if (!statusUpdate) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notUpdate,
            errorCodes?.not_found
        )
    }
    return { statusUpdate }
}

export const getTagCategorywithPagination = async (query) => {
    const { search, status, name, page = 1, limit = 10 } = query || {}
    let pageNumber = Number(page)
    let limitNumber = Number(limit)
    if (pageNumber < 1) {
        pageNumber = 1
    }

    if (limitNumber < 1) {
        limitNumber = 10
    }
    const skip = (pageNumber - 1) * limitNumber
    const searchKeys = {
        name: search
    }
    const searchConditions = Object.entries(regexFilter(searchKeys)).map(
        ([key, value]) => ({
            [key]: value,
        })
    )
    const filter = {
        $or: searchConditions,
        ...(status !== undefined &&
            status !== '' && { isActive: status }),
        ...(name !== undefined &&
            name !== '' && { name: name }),
    }

    const allTagCategory = await tagCategory
        .find(filter)
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 })

    const total = await tagCategory.countDocuments(filter)
    return {
        data: allTagCategory,
        meta: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        },
    }
}

export const getbyId = async (id) => {
    const tagCategoryData = await tagCategory.findById(id);

    if (!tagCategoryData) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }

    return { tagCategoryData };
};

export const editTags = async (id, data) => {

    console.log("object===>", id, data);
    if (!id) {
        throw new CustomError(
            statusCodes?.badRequest,
            Message?.TagIDRequired,
            errorCodes?.bad_request
        )
    }

    const existingTag = await tagCategory.findById(id);

    if (!existingTag) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }

    const updatedTagCategory = await tagCategory.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
    )

    if (!updatedTagCategory) {
        throw new CustomError(
            statusCodes?.badRequest,
            Message?.notUpdate || 'Tag Category update failed',
            errorCodes?.bad_request
        )
    }

    return { updatedTagCategory }
}