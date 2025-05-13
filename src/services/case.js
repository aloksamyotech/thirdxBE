/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-undef */
import Services from '../models/services.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Case from '../models/cases.js'
import User from '../models/user.js'
 
export const addCase = async (req) => {
  const {
    serviceUserId,
    serviceId,
    serviceType,
    serviceStatus,
    caseOpened,
    caseClosed,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
    description,
  } = req?.body
  const filePath = req?.file?.path
 
  if (!serviceUserId || !serviceId || !serviceType || !serviceStatus) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.missingRequiredFields || 'Missing required fields',
      errorCodes.bad_request
    )
  }
 
  const caseData = {
    serviceUserId,
    serviceId,
    serviceType,
    serviceStatus,
    caseOpened,
    caseClosed,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
    description,
  }
  if (filePath) caseData.file = `uploads/${filePath}`
 
  const newCase = await Case.create(caseData)
 
  if (!newCase) {
    throw new CustomError(
      statusCodes.internalServerError,
      Message.notCreated || 'Case creation failed',
      errorCodes.internal_error
    )
  }
 
  return { newCase }
}
 
export const deleteCase = async (req) => {
  // const { id } = req?.params;
  const caseId = req.params.id
  const caseData = await Case.findById(caseId)
 
  if (!caseData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await Case.findByIdAndUpdate(
    caseId,
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
 
export const searchCase = async (req, res) => {
  const { serviceUserId, serviceStatus, serviceType, caseOpened } = req.query
 
  const searchQuery = {
    isDeleted: false,
  }
 
  if (serviceUserId) {
    searchQuery.serviceUserId = { $regex: serviceUserId, $options: 'i' }
  }
 
  if (serviceStatus) {
    searchQuery.serviceStatus = { $regex: serviceStatus, $options: 'i' }
  }
 
  if (serviceType) {
    searchQuery.serviceType = { $regex: serviceType, $options: 'i' }
  }
 
  if (caseOpened) {
    searchQuery.caseOpened = { $gte: new Date(caseOpened) }
  }
 
  const cases = await Case.find(searchQuery).sort({ createdAt: -1 })
 
  if (!cases.length) {
    return res.status(404).json({
      success: false,
      message: 'No cases found matching your criteria.',
    })
  }
 
  return res.status(200).json(cases)
}
 
export const getCaseById = async (req) => {
  const caseId = req?.params?.id
 
  if (!caseId) {
    throw new CustomError(
      statusCodes.notFound,
      Message.notFound || 'Case ID is required',
      errorCodes.not_found
    )
  }
 
  const caseData = await Case.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(caseId), isDeleted: false } },
    {
      $lookup: {
        from: 'services',
        localField: 'serviceId',
        foreignField: '_id',
        as: 'serviceDetails',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'serviceUserId',
        foreignField: '_id',
        as: 'userServiceDetails',
      },
    },
    {
      $unwind: { path: '$serviceDetails', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: {
        path: '$userServiceDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
  ])
 
  if (!caseData || caseData.length === 0) {
    throw new CustomError(
      statusCodes.notFound,
      Message.caseNotFound || 'Case not found',
      errorCodes.user_not_found
    )
  }
 
  return { caseData: caseData[0] }
}
export const getAllCases = async () => {
  const allService = await Case.aggregate([
    { $match: { isDeleted: false } },
 
    {
      $lookup: {
        from: 'services',
        localField: 'serviceId',
        foreignField: '_id',
        as: 'serviceDetails',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'serviceUserId',
        foreignField: '_id',
        as: 'userServiceDetails',
      },
    },
    {
      $unwind: { path: '$serviceDetails', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: {
        path: '$userServiceDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        serviceUserName: {
          $concat: [
            { $ifNull: ['$userServiceDetails.personalInfo.firstName', ''] },
            ' ',
            { $ifNull: ['$userServiceDetails.personalInfo.lastName', ''] },
          ],
        },
        serviceName: {
          $ifNull: ['$serviceDetails.name', ''],
        },
      },
    },
 
    { $sort: { createdAt: -1 } },
  ])
 
  return allService;
}
 