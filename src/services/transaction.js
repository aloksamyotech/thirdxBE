import transaction from '../models/transaction.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'

export const addTransaction = async (data) => {
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

export const filter = async (name, date, campaign) => {
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
  if (campaign) filter.campaign = campaign

  const filterData = await transaction.find(filter)

  return filterData
}

export const editTransaction = async (id, transactionData) => {
  if (!id) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message.notFound,
      errorCodes?.bad_request
    )
  }

  const existingTransaction = await transaction.findById(id)

  if (!existingTransaction) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const updatedTransaction = await transaction.findByIdAndUpdate(
    id,
    { $set: transactionData },
    { new: true }
  )

  if (!updatedTransaction) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notUpdate,
      errorCodes?.bad_request
    )
  }

  return { updatedTransaction }
}

export const deleteTransaction = async (id) => {
  const transactionData = await transaction.findById(id)

  if (!transactionData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const updatedTransaction = await transaction.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  )

  if (!updatedTransaction) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    )
  }
  return { updatedTransaction }
}

export const getTransactionwithPagination = async (query) => {
  const { search, name, createdAt, campaign, page = 1, limit = 10 } = query || {}
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
    assignedTo: search,
    campaign: search,
  }

  const searchConditions = Object.entries(regexFilter(searchKeys)).map(
    ([key, value]) => ({
      [key]: value,
    })
  )

  const filter = {
    $or: searchConditions,
    ...(name !== undefined && name !== '' && { 'assignedTo': name }),
    ...(campaign !== undefined && campaign !== '' && { 'campaign': campaign }),

    ...(createdAt !== undefined && createdAt !== '' && {
      createdAt: {
        $gte: new Date(createdAt),
        $lt: new Date(new Date(createdAt).setDate(new Date(createdAt).getDate() + 1))
      }
    }),
  }

  const allTransaction = await transaction
    .find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })

  const total = await transaction.countDocuments(filter)
  return {
    data: allTransaction,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}
