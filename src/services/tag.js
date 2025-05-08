import tag from '../models/tags.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

export const addTags = async (req) => {

    const data = req?.body || {}

    const newTag = await tag.create(data)
    if (!newTag) {
        return new CustomError(
            statusCodes?.badRequest,
            Message?.notCreated,
            errorCodes?.bad_request
        )
    }
    return { newTag }
}

export const getAllTags = async () => {

    const allTags = await tag.find({ isDeleted: false }).sort({ createdAt: -1 })
    if (!allTags) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    return { allTags }
}

export const updateTagStatus = async (req) => {
    const { tagId } = req?.params || {}
    const { isActive } = req?.body || {}
    const checkExist = await tag.findById(tagId)

    if (!checkExist) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    const statusUpdate = await tag.findByIdAndUpdate(
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

export const filter = async (req) => {
    const { name, status } = req?.query || {}

    let filter = {}
    if (name) filter.name = name
    if (status) filter.isActive = status;

    const filterData = await tag.find(filter)

    return filterData
}
