import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Case from '../models/cases.js'
import mongoose from 'mongoose'

export const addCase = async (caseData) => {
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
    filePath
   } = caseData
 
  if (!serviceUserId || !serviceId || !serviceType || !serviceStatus) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.missingRequiredFields,
      errorCodes.bad_request
    )
  }

  const newCase = await Case.create(caseData)

  if (!newCase) {
    throw new CustomError(
      statusCodes.internalServerError,
      Message.notCreated,
      errorCodes.internal_error
    )
  }

  return { newCase }
}

export const editCase = async (caseId, caseData) => {
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
  } = caseData;

  if (!caseId) {
    throw new CustomError(
      statusCodes?.badRequest,
     Message.notFound,
      errorCodes?.bad_request
    );
  }

  const existingCase = await Case.findById(caseId);

  if (!existingCase) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    );
  }

  if (!serviceUserId || !serviceId || !serviceType || !serviceStatus) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.missingRequiredFields,
      errorCodes.bad_request
    )
  }

  const updatedCase = await Case.findByIdAndUpdate(caseId,
    {$set: caseData},
    {new: true}
  );

  if (!updatedCase) {
    throw new CustomError(
      statusCodes.internalServerError,
      Message.notUpdated,
      errorCodes.internal_error
    )
  }

  return { updatedCase }
}

export const deleteCase = async (caseId) => {
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

export const searchCase = async (query) => {
  const { serviceId, serviceStatus, serviceType, caseOpened } = query

  const searchQuery = { isDeleted: false }

  if (serviceId && mongoose.Types.ObjectId.isValid(serviceId)) {
    searchQuery.serviceId = new mongoose.Types.ObjectId(serviceId)
  }

  if (serviceStatus) {
    searchQuery.serviceStatus = { $regex: serviceStatus, $options: 'i' }
  }

  if (serviceType) {
    searchQuery.serviceType = { $regex: serviceType, $options: 'i' }
  }

  if (caseOpened) {
    const parsedDate = new Date(caseOpened)
    if (!isNaN(parsedDate)) {
      const start = new Date(parsedDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(parsedDate)
      end.setHours(23, 59, 59, 999)
      searchQuery.caseOpened = { $gte: start, $lte: end }
    }
  }

  const cases = await Case.find(searchQuery)
    .populate({
      path: 'serviceId',
      select: 'name description',
    })
    .populate({
      path: 'serviceUserId',
      select: 'personalInfo.firstName personalInfo.lastName personalInfo.email',
    })
    .sort({ createdAt: -1 })

  return cases;
}

export const getCaseById = async (caseId) => {
  if (!caseId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
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

  if (!caseData) {
    throw new CustomError(
      statusCodes.notFound,
      Message.caseNotFound,
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

  return allService
}
