import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Session from '../models/session.js'
import dayjs from 'dayjs'
import mongoose from 'mongoose'

export const addSession = async (sessionData) => {
  const newSession = await Session.create(sessionData)

  if (!newSession) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.notCreated,
      errorCodes.bad_request
    )
  }

  return { newSession }
}

export const editSession = async (id, sessionData) => {
  if (!id) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message.notFound,
      errorCodes?.bad_request
    )
  }

  const existingSession = await Session.findById(id)

  if (!existingSession) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const updateSession = await Session.findByIdAndUpdate(
    id,
    { $set: sessionData },
    { new: true }
  )

  if (!updateSession) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.notCreated,
      errorCodes.bad_request
    )
  }

  return { updateSession }
}

export const deleteSession = async (sessionId) => {
  const serssionData = await Session.findById(sessionId)

  if (!serssionData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await Session.findByIdAndUpdate(
    sessionId,
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

export const searchSession = async (name, isActive, type) => {
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

  const session = await Session.find(searchQuery)

  return {
    session,
  }
}

export const getSessionById = async (serviceId) => {
  if (!serviceId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const userData = await Session.find({ _id: serviceId, isDelete: false })
    .populate('serviceId')
    .populate('serviceuser')
    .populate('country')
    .populate({
      path: 'tags',
      model: 'tag',
      populate: {
        path: 'tagCategoryId',
        model: 'tagCategory'
      }
    });
  if (!userData || userData.length === 0) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return { userData }
}

export const getAllSession = async () => {
  const allSession = await Session.find({ isDelete: false, isCompletlyDelete: false })
    .populate('serviceId')
    .populate('serviceuser')
    .populate('country')
    .sort({
      createdAt: -1,
    })
  if (!allSession) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allSession }
}
export const isExistSession = async (userId) => {
  const exists = await Session.exists({ _id: userId })
  return Boolean(exists)
}

export const getAllWithPagination = async (query) => {
  const {
    status,
    country,
    name,
    date,
    time,
    page = 1,
    limit = 10,
    serviceId,
    serviceuser,
    uniqueId,
    range
  } = query || {}
  let pageNumber = Number(page);
  let limitNumber = Number(limit);
  if (pageNumber < 1) pageNumber = 1;
  if (limitNumber < 1) limitNumber = 10;

  const skip = (pageNumber - 1) * limitNumber;

  const filter = {
    isDelete: false,
    isCompletlyDelete: false,
    ...(mongoose.Types.ObjectId.isValid(country) && { country: new mongoose.Types.ObjectId(country) }),
    ...(time && { time }),
    ...(status !== undefined && status !== '' && { isActive: status === 'true' }),
    ...(mongoose.Types.ObjectId.isValid(serviceId) && { serviceId }),
    ...(mongoose.Types.ObjectId.isValid(serviceuser) && { serviceuser }),
    ...(mongoose.Types.ObjectId.isValid(uniqueId) && { serviceuser: uniqueId }),
  };

  if (range) {
    let startDate;
    const endDate = dayjs().endOf('day');

    switch (range) {
      case 'this-week':
        startDate = dayjs().startOf('week');
        break;
      case 'this-month':
        startDate = dayjs().startOf('month');
        break;
      case 'this-year':
        startDate = dayjs().startOf('year');
        break;
      default:
        startDate = null;
    }

    if (startDate) {
      filter.date = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      };
    }
  }

  if (date) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    filter.date = {
      $gte: startOfDay,
      $lt: endOfDay,
    };
  }

  let allSession = await Session.find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .populate('serviceuser')
    .populate('country')
    .populate({
      path: 'serviceId',
      populate: {
        path: 'serviceType',
      },
    });

  if (name) {
    const regex = new RegExp(name, 'i');
    allSession = allSession.filter(
      (session) =>
        regex.test(session?.serviceuser?.name || '') ||
        regex.test(session?.serviceId?.name || '')
    );
  }

  const total = allSession.length;

  return {
    data: allSession,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};


export const archiveSession = async (sessionId, archiveReason) => {
  const checkExist = await Session.findById({ _id: sessionId })

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await Session.findByIdAndUpdate(
    { _id: sessionId },
    { isArchive: true, archiveReason: archiveReason },
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
export const unArchiveSession = async (sessionId) => {
  const checkExist = await Session.findById({ _id: sessionId })

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const statusUpdate = await Session.findByIdAndUpdate(
    { _id: sessionId },
    { isArchive: false, archiveReason: null },
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
