import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Session from '../models/session.js'

export const addSession = async (sessionData) => {
  const newSession = await Session.create(sessionData)

  if (!newSession) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.notCreated,
      errorCodes.bad_request
    )
  }

  return { newSession }
}

export const editSession = async (id, sessionData) => {
  if (!id) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message.notFound,
      errorCodes?.bad_request
    )
  }

  const existingSession = await Session.findById(id)

  if (!existingSession) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const updateSession = await Session.findByIdAndUpdate(
    id,
    { $set: sessionData },
    { new: true }
  )

  if (!updateSession) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.notCreated,
      errorCodes.bad_request
    )
  }

  return { updateSession }
}

export const deleteSession = async (sessionId) => {
  const serssionData = await Session.findById(sessionId)

  if (!serssionData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await Session.findByIdAndUpdate(
    sessionId,
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

export const searchSession = async (name, isActive, type) => {
  const searchQuery = {}
  if (name) {
    searchQuery.name = { $regex: name, $options: 'i' }
  }

  if (isActive !== undefined) {
    searchQuery.isActive = isActive === 'true'
  }

  if (type) {
    searchQuery.type = { $regex: type, $options: 'i' }
  }

  const session = await Session.find(searchQuery)

  return {
    session,
  }
}

export const getSessionById = async (serviceId) => {
  if (!serviceId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const userData = await Session.find({ serviceId, isDeleted: false })
  .populate('serviceId')
  .populate('serviceuser')
  if (!userData || userData.length === 0) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return { userData }
}

export const getAllSession = async () => {
  const allSession = await Session.find({ isDeleted: false })
    .populate('serviceId')
    .populate('serviceuser')
    .sort({
      createdAt: -1,
    })
  if (!allSession) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allSession }
}
export const isExistSession = async (userId) => {
  const exists = await Session.exists({ _id: userId })
  return Boolean(exists)
}

export const getAllWithPagination = async (query) => {
  const { country, name, date, time, page = 1, limit = 10,serviceId ,serviceuser} = query || {}
  let pageNumber = Number(page)
  let limitNumber = Number(limit)
  if (pageNumber < 1) {
    pageNumber = 1
  }

  if (limitNumber < 1) {
    limitNumber = 10
  }
  const skip = (pageNumber - 1) * limitNumber
  const filter = {
    isDeleted: false,
    ...(serviceuser !== undefined && serviceuser !== '' && { serviceuser }),
    ...(serviceId && { serviceId }),
    ...(country !== undefined && country !== '' && { country }),
    ...(name !== undefined && name !== '' && { name }),
    ...(date !== undefined &&
      date !== '' && {
        date: {
          $gte: new Date(date),
          $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
      }),
    ...(time !== undefined && time !== '' && { time }),
  }

  const allSession = await Session.find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .populate('serviceuser')
     .populate({
      path: 'serviceId',
      populate: {
        path: 'serviceType'
      },
    })

  const total = await Session.countDocuments(filter)
  return {
    data: allSession,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}

export const archiveSession = async (sessionId) => {
  const checkExist = await Session.findById({ _id: sessionId })

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await Session.findByIdAndUpdate(
    { _id: sessionId },
    { isArchive: true },
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
export const unArchiveSession = async (sessionId) => {
  const checkExist = await Session.findById({ _id: sessionId })

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await Session.findByIdAndUpdate(
    { _id: sessionId },
    { isArchive: false },
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

