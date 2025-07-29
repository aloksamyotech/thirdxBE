import Services from '../models/services.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'
import configuration from '../models/configuration.js'
import tag from '../models/tags.js'

export const addServices = async (serviceData) => {
  const existingService = await Services.findOne({ code: serviceData.code });

  if (existingService) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.serviceCodeExist,
      errorCodes.already_exist
    )
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

export const deleteServices = async (serviceId) => {
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

export const searchServices = async (queryData) => {
  const { name, isActive, type } = queryData

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

  return {
    services,
  }
}

export const getServiceById = async (serviceId) => {
  if (!serviceId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    );
  }

  const userData = await Services.findOne({ _id: serviceId, isDelete: false })
    .populate({
      path: 'tags',
      model: 'tag',
      populate: {
        path: 'tagCategoryId',
        model: 'tagCategory'
      }
    });

  if (!userData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    );
  }

  return { userData };
};

export const getServiceswithPagination = async (query) => {
  const { search, status, serviceType, page = 1, limit = 10, deleted, } = query || {}
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
    code: search,
  }
  const searchConditions = Object.entries(regexFilter(searchKeys)).map(
    ([key, value]) => ({
      [key]: value,
    })
  )

  const filter = {
    $or: searchConditions,
    isArchive: false,
    isCompletlyDelete: false,
    ...(status !== undefined &&
      status !== '' && { isActive: status === 'true' }),
    ...(serviceType !== undefined &&
      serviceType !== '' && { serviceType: serviceType }),
    ...(typeof deleted !== 'undefined' ? { isDelete: deleted === 'true' } : { isDelete: false }),

  }

  const allService = await Services.find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .populate('serviceType', 'name')

  const total = await Services.countDocuments(filter)
  return {
    data: allService,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}

export const editServices = async (serviceId, serviceData) => {
  if (!serviceId) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message.invalidServiceId,
      errorCodes?.bad_request
    )
  }

  const existingService = await Services.findById(serviceId)

  if (!existingService) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const updatedService = await Services.findByIdAndUpdate(
    serviceId,
    { $set: serviceData },
    { new: true }
  )

  if (!updatedService) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.serviceNotUpdated || 'Service update failed',
      errorCodes?.bad_request
    )
  }

  return { updatedService }
}

export const getAllServices = async () => {
  return await Services.find({ isDelete: false, isCompletlyDelete: false })
    .sort({
      createdAt: -1,
    })
}


export const toggleArchiveSession = async (sessionId, isArchive = true, archiveReason = null) => {
  const checkExist = await Services.findById(sessionId);

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    );
  }

  const statusUpdate = await Services.findByIdAndUpdate(
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


export const deleteSession = async (sessionId) => {
  const checkExist = await Services.findById(sessionId);

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    );
  }

  const softDelete = await Services.findByIdAndUpdate(
    sessionId, {
    isDelete: true
  },
    { new: true }
  );

  if (!softDelete) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    );
  }

  return { softDelete };
};
const getTagIdsByNames = async (names) => {
  if (!names) return [];
  const nameArray = names.split(',').map(n => n.trim());
  const tags = await tag.find({ name: { $in: nameArray }}).select('_id');
  return tags.map(tag => tag._id);
};
export const bulkUpload = async (services) => {
  const results = [];
  for (const data of services) {
    try {
      const name =data?.service_type.trim();
      const serviceType = await configuration.findOne({name:name,configurationType:'Service Types'});
      if (!serviceType) {
        console.log("service Types not found for this - ", data.service_type);
        continue;
      }
      // Tag-based fields
      const tags = await getTagIdsByNames(data.tags) || [];
      const newService = new Services({
        name: data?.service_name,
        code: data?.service_code,
        serviceType: serviceType?._id,
        file: data?.file,
        tags:tags,
        description: data.notes,
      });

      await newService.save();
      results.push(newService);
    } catch (itemError) {
      console.log("Error saving this item - ", data, itemError);
    }
  }

  return { results };

}
