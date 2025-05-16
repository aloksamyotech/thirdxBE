import transaction from '../models/transaction.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

export const addTransaction = async (req) => {

    const data = req?.body || {}

    const newTransaction = await transaction.create(data)
    if (!newTransaction) {
        return new CustomError(
            statusCodes?.badRequest,
            Message?.notCreated,
            errorCodes?.bad_request
        )
    }
    return { newTransaction }
}

export const getAllTransaction = async () => {

    const allTransaction = await transaction.find().sort({ createdAt: -1 })
    if (!allTransaction) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    return { allTransaction }
}

export const filter = async (req) => {
    const { name, date, campaign } = req?.query || {}

    let filter = {}
    if (name) filter.assignedTo = name
    
     if (date) {
    const parsedDate = new Date(date)
    if (!isNaN(parsedDate)) {
      const start = new Date(parsedDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(parsedDate)
      end.setHours(23, 59, 59, 999)
      filter.createdAt = { $gte: start, $lte: end }
    }
  }
    if (campaign) filter.campaign = campaign;

    const filterData = await transaction.find(filter)

    return filterData
}
