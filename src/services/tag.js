import tag from '../models/tags.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'

export const addTags = async (req) => {
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

export const updateTagStatus = async (tagId, isActive) => {
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

export const filter = async (name, status) => {
  let filter = {}
  if (name) filter.name = name
  if (status) filter.isActive = status

  const filterData = await tag.find(filter)

  return filterData
}

export const editTags = async (tagId, tagData) => {
  if (!tagId) {
    throw new CustomError(
      statusCodes?.badRequest,
      'Invalid Tag ID',
      errorCodes?.bad_request
    )
  }

  const existingTag = await tag.findById(tagId)

  if (!existingTag) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound || 'Tag not found',
      errorCodes?.not_found
    )
  }

  const updatedTag = await tag.findByIdAndUpdate(
    tagId,
    { $set: tagData },
    { new: true }
  )

  if (!updatedTag) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notUpdate || 'Tag update failed',
      errorCodes?.bad_request
    )
  }

  return { updatedTag }
}

export const deleteTags = async (tagId) => {
  const tagData = await tag.findById(tagId)

  if (!tagData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const tagUpdate = await tag.findByIdAndUpdate(
    tagId,
    { isDeleted: true },
    { new: true }
  )

  if (!tagUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    )
  }
  return { tagUpdate }
}

export const getTagwithPagination = async (query) => {
  const { search, status, page = 1, limit = 10 } = query || {}
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

  const filter = {
    ...regexFilter(searchKeys),
    ...(status !== undefined &&
      status !== '' && { isActive: status === 'true' }),
  }

  const allTag = await tag
    .find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })

  const total = await tag.countDocuments(filter)
  return {
    data: allTag,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}
