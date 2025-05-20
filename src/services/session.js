/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-undef */
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Session from '../models/session.js'

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
      );
    }
  
    const existingSession = await Session.findById(id);
  
    if (!existingSession) {
      throw new CustomError(
        statusCodes?.notFound,
        Message?.notFound,
        errorCodes?.not_found
      );
    }
 
  const updateSession = await Session.findByIdAndUpdate(id,
    {$set : sessionData},
    {new: true}
  );
 
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
    session
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

  const userData = await Session.find({ serviceId, isDeleted: false });

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
  const allSession = await Session.find({ isDeleted: false }).sort({
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
  const exists = await Session.exists({ _id: userId });
  return Boolean(exists);
}
