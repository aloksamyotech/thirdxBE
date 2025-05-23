import user from '../models/user.js'
import {
  checkRole,
  errorCodes,
  externalAPI,
  Message,
  statusCodes,
} from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import axios from 'axios'
import { regexFilter } from '../core/common/common.js'
import mongoose from 'mongoose'

export const addUser = async (userData) => {
  const newUser = await user.create(userData)
  if (!newUser) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
  return { newUser }
}

export const getAllServiceUser = async () => {
  const allUser = await user
    .find({ isDeleted: false, role: checkRole.service_user })
    .sort({ createdAt: -1 })
    .populate('contactPreferences.preferredMethod')
    .populate('contactPreferences.contactPurposes')
    .populate('contactPreferences.reason')
    .populate('companyInformation.recruitmentCampaign');
  if (!allUser) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allUser }
}

export const getAllVolunteer = async () => {
  const allVolunteer = await user
    .find({ isDeleted: false, role: checkRole.volunteer })
    .sort({ createdAt: -1 })
    .populate('contactPreferences.preferredMethod')
    .populate('contactPreferences.contactPurposes')
    .populate('contactPreferences.reason')
    .populate('companyInformation.recruitmentCampaign');
  if (!allVolunteer) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allVolunteer }
}
export const getAllUsers = async () => {
  const allVolunteer = await user
    .find({ isDeleted: false, role: checkRole.user })
    .sort({ createdAt: -1 })
    .populate('contactPreferences.preferredMethod')
    .populate('contactPreferences.contactPurposes')
    .populate('contactPreferences.reason')
    .populate('companyInformation.recruitmentCampaign');
  if (!allVolunteer) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allVolunteer }
}

export const getAllDonor = async () => {
  const allDonor = await user
    .find({ isDeleted: false, role: checkRole.donor })
    .sort({ createdAt: -1 })
    .populate('contactPreferences.preferredMethod')
    .populate('contactPreferences.contactPurposes')
    .populate('contactPreferences.reason')
    .populate('companyInformation.recruitmentCampaign');

  if (!allDonor) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allDonor }
}

export const getUserById = async (userId) => {
  if (!userId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const userData = await user.findOne({ _id: userId, isDeleted: false })
    .populate('contactPreferences.preferredMethod')
    .populate('contactPreferences.contactPurposes')
    .populate('contactPreferences.reason')
    .populate('companyInformation.recruitmentCampaign');

  if (!userData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return userData
}

export const getAllUsDistricts = async () => {
  const response = await axios.get(externalAPI.district)

  const [headers, ...rows] = response.data

  const cityStateArray = rows.map((row) => {
    const [placeWithState] = row
    const city = placeWithState
      .split(',')[0]
      .replace(/\s(city|town|CDP)$/i, '')
      .trim()
    const state = placeWithState.split(',')[1].replace(/\s+$/, '').trim()

    return `${city}, ${state}`
  })

  return {
    cities: cityStateArray,
  }
}

export const editUser = async (userData) => {
  const { userId, ...rest } = userData

  if (!userId) {
    return new CustomError(
      statusCodes?.badRequest,
      'Invalid user ID',
      errorCodes?.bad_request
    )
  }

  const existingUser = await user.findById({ _id: userId })

  if (!existingUser) {
    return new CustomError(
      statusCodes?.notFound,
      Message?.userNotFound || 'User not found',
      errorCodes?.not_found
    )
  }

  const updatedUser = await user.findByIdAndUpdate(
    { _id: userId },
    { $set: rest },
    { new: true, runValidators: true }
  )

  if (!updatedUser) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.userNotUpdated || 'User could not be updated',
      errorCodes?.bad_request
    )
  }

  return { updatedUser }
}

export const deleteUser = async (userId) => {
  const checkExist = await user.findById({ _id: userId })

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await user.findByIdAndUpdate(
    { _id: userId },
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

export const archiveUser = async (userId) => {
  const checkExist = await user.findById({ _id: userId })

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await user.findByIdAndUpdate(
    { _id: userId },
    { archive: true },
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

export const unArchiveUser = async (userId) => {
  const checkExist = await user.findById({ _id: userId })

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await user.findByIdAndUpdate(
    { _id: userId },
    { archive: false },
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

export const getUserwithPagination = async (query) => {
  const {
    search,
    status,
    district,
    createdAt,
    gender,
    nickName,
    uniqueId,
    campaigns,
    country,
    archive,
    role,
    userId,
    name,
    page = 1,
    limit = 10,
  } = query || {}

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
    'personalInfo.firstName': search,
    'personalInfo.lastName': search,
    'companyInformatiom.companyName': search,
    role: search,
    subRole: search,
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
    ...(archive !== undefined && archive !== '' && { archive: archive }),
    ...(district !== undefined &&
      district !== '' && { 'contactInfo.district': district }),
    ...(gender !== undefined &&
      gender !== '' && { 'personalInfo.gender': gender }),
    ...(nickName !== undefined &&
      nickName !== '' && { 'personalInfo.nickName': nickName }),
    ...(uniqueId !== undefined && uniqueId !== '' && { uniqueId: uniqueId }),
    ...(campaigns !== undefined &&
      campaigns !== '' && { 'otherInfo.campaigns': campaigns }),
    ...(country !== undefined &&
      country !== '' && { 'contactInfo.country': country }),
    ...(role !== undefined && role !== '' && { role: role }),
    ...(userId !== undefined &&
      userId !== '' && { caseId: new mongoose.Types.ObjectId(userId) }),
    ...(name !== undefined && name !== '' && { _id: name }),

    ...(createdAt !== undefined &&
      createdAt !== '' && {
        createdAt: {
          $gte: new Date(createdAt),
          $lt: new Date(
            new Date(createdAt).setDate(new Date(createdAt).getDate() + 1)
          ),
        },
      }),
  }

  const allUser = await user
    .find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .notDeleted()

  const total = await user.countDocuments(filter)
  return {
    data: allUser,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}

export const isExistUser = async (userId) => {
  const exists = await user.exists({ _id: userId })
  return Boolean(exists)
}
