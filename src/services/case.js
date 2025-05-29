import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Case from '../models/cases.js'
import mongoose from 'mongoose'
import { regexFilter } from '../core/common/common.js'

export const addCase = async (caseData) => {
  const {
    serviceUserId,
    serviceId,
    serviceType,
    caseOpened,
    caseClosed,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
    description,
    file,
    isActive,
  } = caseData;

  if (!serviceUserId || !serviceId || !serviceType||!isActive) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.missingRequiredFields,
      errorCodes.bad_request
    );
  }
 const uniqueId = await generateCustomId();

  const activeStatus = isActive === 'true';

  const newCase = await Case.create({
    serviceUserId,
    serviceId,
    serviceType,
    caseOpened,
    caseClosed,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
    description,
    file,
    isActive: activeStatus,
    uniqueId
  });

  if (!newCase) {
    throw new CustomError(
      statusCodes.internalServerError,
      Message.notCreated,
      errorCodes.internal_error
    );
  }

  return { newCase };
};

export const editCase = async (caseId, caseData) => {
  const {
    serviceUserId,
    serviceId,
    serviceType,
    caseOpened,
    caseClosed,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
    description,
    filePath,
    isActive,
  } = caseData;

  if (!caseId) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message.notFound,
      errorCodes?.bad_request
    );
  }

  const activeStatus = isActive === 'true' ? true : isActive === 'false' ? false : isActive;

  if (!serviceUserId || !serviceId || !serviceType || typeof activeStatus === 'undefined') {
    throw new CustomError(
      statusCodes.badRequest,
      Message.missingRequiredFields,
      errorCodes.bad_request
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

  const updateData = {
    serviceUserId,
    serviceId,
    serviceType,
    caseOpened,
    caseClosed,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
    description,
    filePath,
    isActive: activeStatus,
  };

  const updatedCase = await Case.findByIdAndUpdate(
    caseId,
    { $set: updateData },
    { new: true }
  );

  if (!updatedCase) {
    throw new CustomError(
      statusCodes.internalServerError,
      Message.notUpdated,
      errorCodes.internal_error
    );
  }

  return { updatedCase };
};

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

  return cases
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

export const getCasewithPagination = async (query) => {
  const {
    search,
    status,
    serviceId,
    serviceType,
    createdAt,
    page = 1,
    limit = 10,
  } = query || {};

  let pageNumber = Number(page);
  let limitNumber = Number(limit);

  if (pageNumber < 1) pageNumber = 1;
  if (limitNumber < 1) limitNumber = 10;

  const skip = (pageNumber - 1) * limitNumber;

  const filter = {
    ...(status !== undefined && status !== '' && { isActive: status === 'true' }),
    ...(serviceType !== undefined && serviceType !== '' && { serviceType }),
    ...(serviceId !== undefined && serviceId !== '' && { serviceId }),
    ...(createdAt !== undefined && createdAt !== '' && {
      createdAt: {
        $gte: new Date(createdAt),
        $lt: new Date(new Date(createdAt).setDate(new Date(createdAt).getDate() + 1)),
      },
    }),
  };

  const allCases = await Case.find(filter)
    .sort({ createdAt: -1 })
    .populate('serviceUserId')
    .populate('serviceId')
    .populate('benificiary')
    .populate('campaigns')
    .populate('engagement')
    .populate('eventAttanded')
    .populate('fundingInterest')
    .populate('fundraisingActivities')

  const filteredCases = search
    ? allCases.filter((c) => {
        const firstName = c.serviceUserId?.personalInfo?.firstName?.toLowerCase() || '';
        const lastName = c.serviceUserId?.personalInfo?.lastName?.toLowerCase() || '';
        const searchLower = search.toLowerCase();
        return (
          firstName.includes(searchLower) || lastName.includes(searchLower)
        );
      })
    : allCases;

  const paginatedCases = filteredCases.slice(skip, skip + limitNumber);

  return {
    data: paginatedCases,
    meta: {
      total: filteredCases.length,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(filteredCases.length / limitNumber),
    },
  };
};
