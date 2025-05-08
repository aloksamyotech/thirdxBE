import configuration from '../models/configuration.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

export const addConfiguration = async (req) => {

    const { name, isActive, configurationType } = req?.body || {}

    const newConfiguration = await configuration.create({ name, isActive, configurationType })
    if (!newConfiguration) {
        return new CustomError(
            statusCodes?.badRequest,
            Message?.notCreated,
            errorCodes?.bad_request
        )
    }
    return { newConfiguration }
}

export const getAllConfiguration = async () => {

    const allConfiguration = await configuration.find({ isDeleted: false }).sort({ createdAt: -1 })
    if (!allConfiguration) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    return { allConfiguration }
}

export const updateConfigurationStatus = async (req) => {
    const { configId } = req?.params || {}
    const { isActive } = req?.body || {}
    const checkExist = await configuration.findById(configId)

    if (!checkExist) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    const statusUpdate = await configuration.findByIdAndUpdate(
        configId,
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

export const deleteConfiguration = async (req) => {
    const { configId } = req?.params || {}
    const checkExist = await configuration.findById(configId)

    if (!checkExist) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    const statusUpdate = await configuration.findByIdAndUpdate(
        configId,
        { isDeleted: true },
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

export const searchConfigurationByName = async (req) => {
    const { name } = req?.query || {}

    const searchConfig = await configuration.find({ name: { $regex: name }, isDeleted: false })

    return searchConfig
}

export const filter = async (req) => {
    const { type, status } = req?.query || {}

    let filter = {}
    if (type) filter.configurationType = type;
    if (status) filter.isActive = status
    filter.isDeleted = false

    const filterConfig = await configuration.find(filter)

    return filterConfig
}
