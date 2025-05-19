/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-undef */
import Services from '../models/services.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'

export const addServices = async (serviceData) => {
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

export const searchServices = async (queryData) => {
  const { name, isActive, type } = queryData;

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
    services
  }
}

export const getServiceById = async (serviceId) => {
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

export const getServiceswithPagination = async (query) => {
  const { search, status, page = 1, limit = 10 } = query || {};
  let pageNumber = Number(page);
  let limitNumber = Number(limit);
  if (pageNumber < 1) {
    pageNumber = 1
  }

  if (limitNumber < 1) {
    limitNumber = 10
  }
  const skip = (pageNumber - 1) * limitNumber;
  const searchKeys = {
    name: search,
  };

  const filter = {
    ...regexFilter(searchKeys),
    ...(status !== undefined && status !== '' && { isActive: status === 'true' })
  };

  const allService = await Services.find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 });

  const total = await Services.countDocuments(filter);
  return {
    data: allService,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber)
    }
  };
}

export const editServices = async (serviceId, serviceData) => {
 
  if (!serviceId) {
    throw new CustomError(
      statusCodes?.badRequest,
     Message.invalidServiceId,
      errorCodes?.bad_request
    );
  }




  const existingService = await Services.findById(serviceId);

  if (!existingService) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound ,
      errorCodes?.not_found
    );
  }

  const updatedService = await Services.findByIdAndUpdate(
    serviceId,
    { $set: serviceData },
    { new: true }
  );

  if (!updatedService) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.serviceNotUpdated || 'Service update failed',
      errorCodes?.bad_request
    );
  }

  return { updatedService };
};


export const getAllServices = async () => {
  return await Services.find({ isDeleted: false }).sort({
    createdAt: -1,
  });
}
