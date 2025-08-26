import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Case from '../models/cases.js'
import mongoose from 'mongoose'
import { regexFilter } from '../core/common/common.js'
import { generateCustomId } from '../utils/generateCustomId.js'
import user from '../models/user.js'
import Services from '../models/services.js'
import tag from '../models/tags.js'
export const addCase = async (caseData) => {
  const {
    serviceUserId,
    serviceId,
    caseOwner,
    caseOpened,
    caseClosed,
    tags,
    description,
    file,
  } = caseData;

  if (!serviceUserId || !serviceId || !caseOwner || !caseOpened) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.missingRequiredFields,
      errorCodes.bad_request
    );
  }

  const today = new Date();
  const openedDate = new Date(caseOpened);
  openedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  let finalStatus;
  if (openedDate <= today) {
    finalStatus = 'open';
  } else {
    finalStatus = 'pending';
  }

  const uniqueId = await generateCustomId();

  const newCase = await Case.create({
    serviceUserId,
    serviceId,
    caseOwner,
    caseOpened,
    caseClosed,
    tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
    description,
    file,
    status: finalStatus,
    uniqueId,
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
    caseOwner,
    caseOpened,
    caseClosed,
    tags,
    description,
    file,
    status,
  } = caseData;

  if (!caseId) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message.notFound,
      errorCodes?.bad_request
    )
  }


  if (
    !serviceUserId ||
    !serviceId ||
    !caseOwner ||
    typeof status === 'undefined'
  ) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.missingRequiredFields,
      errorCodes.bad_request
    )
  }

  const existingCase = await Case.findById(caseId)
  if (!existingCase) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const updateData = {
    serviceUserId,
    serviceId,
    caseOwner,
    caseOpened,
    caseClosed,
    tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
    description,
    file,
    status
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
    { isDelete: true },
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
  const { serviceId, serviceStatus, caseOwner, caseOpened } = query

  const searchQuery = { isDelete: false }

  if (serviceId && mongoose.Types.ObjectId.isValid(serviceId)) {
    searchQuery.serviceId = new mongoose.Types.ObjectId(serviceId)
  }

  if (serviceStatus) {
    searchQuery.serviceStatus = { $regex: serviceStatus, $options: 'i' }
  }

  if (caseOwner) {
    searchQuery.caseOwner = { $regex: caseOwner, $options: 'i' }
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
    { $match: { _id: new mongoose.Types.ObjectId(caseId), isDelete: false } },
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
        from: 'admins',
        localField: 'caseOwner',
        foreignField: '_id',
        as: 'caseOwnerDetails'
      }
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
      $lookup: {
        from: 'tags',
        localField: 'tags',
        foreignField: '_id',
        as: 'tags'
      }
    },

    {
      $unwind: {
        path: '$tags',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'tagcategories',
        localField: 'tags.tagCategoryId',
        foreignField: '_id',
        as: 'tags.tagCategoryId'
      }
    },
    {
      $unwind: {
        path: '$tags.tagCategoryId',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: '$_id',
        doc: { $first: '$$ROOT' },
        tags: { $push: '$tags' }
      }
    },
    {
      $addFields: {
        'doc.tags': '$tags'
      }
    },
    {
      $replaceRoot: {
        newRoot: '$doc'
      }
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
    { $match: { isDelete: false, isCompletlyDelete: false } },

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
    startDate,
    endDate,
    search,
    status,
    uniqueId,
    serviceId,
    caseOwner,
    createdAt,
    country,
    name,
    caseOpened,
    deleted,
    page = 1,
    limit = 10,
  } = query || {}

  let pageNumber = Number(page)
  let limitNumber = Number(limit)

  if (pageNumber < 1) pageNumber = 1
  if (limitNumber < 1) limitNumber = 10

  const skip = (pageNumber - 1) * limitNumber

  const filter = {
    isCompletlyDelete: false,
    ...(caseOwner !== undefined && caseOwner !== '' && { caseOwner }),
    ...(status !== undefined && status !== '' && { status }),
    ...(serviceId !== undefined && serviceId !== '' && { serviceId }),
    ...(typeof deleted !== 'undefined' ? { isDelete: deleted === 'true' } : { isDelete: false }),
     ...(startDate && endDate && {
      createdAt: {
        $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      }
    }),
    ...(createdAt !== undefined &&
      createdAt !== '' && {
      createdAt: {
        $gte: new Date(createdAt),
        $lt: new Date(
          new Date(createdAt).setDate(new Date(createdAt).getDate() + 1)
        ),
      },
    }),
    ...(name !== undefined && name !== '' && { serviceUserId: name }),
    ...(uniqueId !== undefined &&
      uniqueId !== '' && { serviceUserId: uniqueId }),
    ...(caseOpened !== undefined &&
      caseOpened !== '' && {
      caseOpened: {
        $gte: new Date(caseOpened),
        $lt: new Date(
          new Date(caseOpened).setDate(new Date(caseOpened).getDate() + 1)
        ),
      },
    }),
  }

  const allCases = await Case.find(filter)
    .sort({ createdAt: -1 })
    .populate('serviceUserId')
    .populate('serviceId')
    .populate('caseOwner')

  const filteredCases =
    search || country
      ? allCases.filter((c) => {
        const firstName =
          c.serviceUserId?.personalInfo?.firstName?.toLowerCase() || ''
        const lastName =
          c.serviceUserId?.personalInfo?.lastName?.toLowerCase() || ''
        const countryName =
          c.serviceUserId?.contactInfo?.country?.toLowerCase() || ''

        const searchLower = search?.toLowerCase()
        const countryLower = country?.toLowerCase()

        const matchesSearch = search
          ? firstName.includes(searchLower) || lastName.includes(searchLower)
          : true

        const matchesCountry = country
          ? countryName.includes(countryLower)
          : true

        return matchesSearch && matchesCountry
      })
      : allCases

  const paginatedCases = filteredCases.slice(skip, skip + limitNumber)

  return {
    data: paginatedCases,
    meta: {
      total: filteredCases.length,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(filteredCases.length / limitNumber),
    },
  }
}

const BATCH_SIZE = 10;

export const updateCaseStatus = async () => {
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const cases = await Case.find({ isDelete: false }).skip(skip).limit(BATCH_SIZE).lean();

    if (cases.length === 0) {
      break;
    }

    for (const item of cases) {
      try {
        const currentDate = new Date();
        if (currentDate >= item.caseOpened && currentDate < item.caseClosed && item.status != 'open') {
          await Case.findByIdAndUpdate(
            item?._id,
            { status: 'open' }
          )
        } else if (currentDate >= item.caseClosed && item.status != 'close') {
          await Case.findByIdAndUpdate(
            item?._id,
            { status: 'close' }
          )
        }
      } catch (error) {
        console.error(`❌ Failed to update case status ${item._id}:`, error.message);
      }
    }

    skip += BATCH_SIZE;
    hasMore = cases.length === BATCH_SIZE;
  }
}

export const toggleArchiveCase = async (sessionId, isArchive = true, archiveReason = null) => {
  const checkExist = await Case.findById(sessionId);

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    );
  }

  const statusUpdate = await Case.findByIdAndUpdate(
    sessionId,
    {
      isArchive,
      archiveReason: isArchive ? archiveReason : null
    },
    { new: true }
  );

  if (!statusUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    );
  }

  return { statusUpdate };
};

const getTagIdsByNames = async (names) => {
  if (!names) return [];
  const nameArray = names.split(',').map(n => n.trim());
  const tags = await tag.find({ name: { $in: nameArray } }).select('_id');
  return tags.map(tag => tag._id);
};

export const bulkUpload = async (cases) => {
  const results = [];

  for (const data of cases) {
    try {
      const nameArray = data.service_user.split(' ').map(n => n.trim());
      const serviceUser = await user.findOne({
        'personalInfo.firstName': nameArray[0],
        'personalInfo.lastName': nameArray[1],
        role: 'service_user',
      });
      if (!serviceUser) {
        continue;
      }

      const nameArray2 = data.case_owner.split(' ').map(n => n.trim());
      const caseOwner = await user.findOne({
        'personalInfo.firstName': nameArray2[0],
        'personalInfo.lastName': nameArray2[1],
        role: 'service_user',
      });
      if (!caseOwner) {
        continue;
      }

      const service = await Services.findOne({ name: data.service });
      if (!service) {
        continue;
      }

      const tags = await getTagIdsByNames(data?.tags) || [];
      const uniqueId = await generateCustomId()
      const openDate = new Date(data.case_open_date);
      const currentDate = new Date();
      const status = openDate > currentDate ? 'pending' : 'open';

      const newCase = new Case({

        serviceUserId: serviceUser._id,
        caseOwner: caseOwner._id,
        serviceId: service._id,
        tags: tags,
        caseOpened: new Date(data.case_open_date),
        caseClosed: new Date(data.case_closed_date),
        notes: data.notes,
        file: data.file,
        uniqueId,
        status
      });

      await newCase.save();
      results.push(newCase);
    } catch (itemError) {
      console.log("Error saving this item - ", data, itemError);
    }
  }

  return { results };

}


export const getCasesByServiceUserId = async (serviceUserId) => {

  const caseData = await Case.findOne({
    serviceUserId: new mongoose.Types.ObjectId(serviceUserId)
  })
    .sort({ createdAt: -1 })
  return caseData
}


