/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-undef */
import Services from '../models/services.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

export const addServices = async (req) => {
  const {
    name,
    code,
    isActive,
    type,
    description,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
  } = req.body

  const serviceData = {
    name,
    code,
    isActive,
    type,
    description,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
  }

  if (req.file && req.file.filename) {
    serviceData.file = `${req.file.filename}`
  }

  const newService = await Services.create(serviceData)

  if (!newService) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.notCreated,
      errorCodes.bad_request
    )
  }

  return { newService }
}
export const deleteServices = async (req) => {
  const serviceId = req.params.id
  const serviceData = await Services.findById(serviceId)

  if (!serviceData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await Services.findByIdAndUpdate(
    serviceId,
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

export const searchServices = async (req, res) => {
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

  const services = await Services.find(searchQuery)

  if (services.length === 0) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  return{
    services
  }
}

export const getServiceById = async (req) => {
  const serviceId = req?.params.id

  if (!serviceId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const userData = await Services.findOne({ _id: serviceId, isDeleted: false })
  if (!userData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return { userData }
}

export const getAllServices = async () => {
  const allService = await Services.find({ isDeleted: false }).sort({
    createdAt: -1,
  })
  if (!allService) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allService }
}
