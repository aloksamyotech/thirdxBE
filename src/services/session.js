/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-undef */
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Session from '../models/session.js'

export const addSession = async (req) => {
  const {
    name,
    country,
    description,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    time,
    date,
    fundraisingActivities,
    serviceId,
  } = req.body
 
  const sessionData = {
    name,
    country,
    description,
    benificiary,
    campaigns,
    engagement,
    time,
    date,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
    serviceId,
  }
 
  if (req.file && req.file.filename) {
    sessionData.file = `${req.file.filename}`
  }
 
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
 
export const deleteSession = async (req) => {
  const sessionId = req.params.id
  const serssionData = await Session.findById(serviceId)

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

export const searchSession = async (req, res) => {
  const { name, isActive, type } = req.query

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
    session
  }
}

export const getSessionById = async (req) => {
  const serviceId = req?.params.id

  if (!serviceId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const userData = await Session.find({ serviceId, isDeleted: false });

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
  const allSession = await Session.find({ isDeleted: false }).sort({
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
