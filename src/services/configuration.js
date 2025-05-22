import configuration from '../models/configuration.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'

export const addConfiguration = async (configData) => {
  const newConfiguration = await configuration.create(configData)
  if (!newConfiguration) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
  return { newConfiguration }
}

export const updateConfiguration = async (configId, configData) => {
  if (!configId) {
    return new CustomError(
      statusCodes?.badRequest,
      'Configuration ID is required',
      errorCodes?.bad_request
    )
  }
  const updatedConfiguration = await configuration.findByIdAndUpdate(
    configId,
    {
      $set: configData,
    },
    { new: true }
  )

  const UpdatedFetch = await updatedConfiguration.save()

  if (!UpdatedFetch) {
    return new CustomError(
      statusCodes?.notFound,
      'Configuration not found or not updated',
      errorCodes?.not_found
    )
  }

  return { UpdatedFetch }
}

export const getAllConfiguration = async () => {
  const allConfiguration = await configuration
    .find({ isDeleted: false })
    .sort({ createdAt: -1 })
  if (!allConfiguration) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allConfiguration }
}

export const updateConfigurationStatus = async (configId, isActive) => {
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

export const deleteConfiguration = async (configId) => {
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

export const searchConfigurationByName = async (name) => {
  const searchConfig = await configuration.find({
    name: { $regex: name },
    isDeleted: false,
  })

  return searchConfig
}

export const filter = async (type, status) => {
  let filter = {}
  if (type) filter.configurationType = type
  if (status) filter.isActive = status
  filter.isDeleted = false

  const filterConfig = await configuration.find({
    configurationType: { $regex: type },
    isDeleted: false,
  })

  return filterConfig
}

export const getConfigurationWithPagination = async (query) => {
  const { search, status, configurationType, page = 1, limit = 10 } = query || {}
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
    configurationType: search,
  }

  const searchConditions = Object.entries(regexFilter(searchKeys)).map(
    ([key, value]) => ({
      [key]: value,
    })
  )

  const filter = {
    $or: searchConditions,
    ...(status !== undefined &&
      status !== '' && { isActive: status === 'true' }),
      ...(configurationType !== undefined && configurationType !== '' && { 'configurationType': configurationType }),
    
  }

  const allConfiguration = await configuration
    .find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .nonDeleted()

  const total = await configuration.countDocuments(filter)
  return {
    data: allConfiguration,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}
