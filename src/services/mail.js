import mail from '../models/mail.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'

export const addMail = async (data) => {
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

export const filter = async (tag, name) => {
  let filter = {}
  if (tag) filter.tags = tag
  if (name) filter.name = name

  const filterData = await mail.find(filter)

  return filterData
}

export const editMail = async (mailId, mailData) => {
  if (!mailId) {
    throw new CustomError(
      statusCodes?.badRequest,
      'Invalid Mail ID',
      errorCodes?.bad_request
    )
  }

  const existingMail = await mail.findById(mailId)

  if (!existingMail) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound || 'Mail not found',
      errorCodes?.not_found
    )
  }

  const updatedMail = await mail.findByIdAndUpdate(
    mailId,
    { $set: mailData },
    { new: true }
  )
  if (!updatedMail) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notUpdated || 'Mail update failed',
      errorCodes?.bad_request
    )
  }
  return { updatedMail }
}

export const deleteMail = async (mailId) => {
  const mailData = await mail.findById(mailId)

  if (!mailData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const mailUpdate = await mail.findByIdAndUpdate(
    mailId,
    { isDeleted: true },
    { new: true }
  )

  if (!mailUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    )
  }
  return { mailUpdate }
}

export const getMailWithPagination = async (query) => {
  const { search, page = 1, limit = 10 } = query || {}
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
    name: search,
  }

  const allMail = await mail
    .find(regexFilter(searchKeys))
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })

  const total = await mail.countDocuments(regexFilter(searchKeys))
  return {
    data: allMail,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}
