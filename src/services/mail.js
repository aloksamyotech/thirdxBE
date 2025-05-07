import mail from '../models/mail.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

export const addMail = async (req) => {

    const data = req?.body || {}

    const newMail = await mail.create(data)
    if (!newMail) {
        return new CustomError(
            statusCodes?.badRequest,
            Message?.notCreated,
            errorCodes?.bad_request
        )
    }
    return { newMail }
}

export const getAllMail = async () => {

    const allMail = await mail.find().sort({ createdAt: -1 })
    if (!allMail) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    return { allMail }
}

export const filter = async (req) => {
    const { tag, name } = req?.query || {}

    let filter = {}
    if (tag) filter.tags = tag;
    if (name) filter.name = name

    const filterData = await mail.find(filter)

    return filterData
}
