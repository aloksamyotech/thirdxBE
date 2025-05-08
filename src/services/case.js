/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-undef */
import Services from '../models/services.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Case from '../models/cases.js'

export const addCase = async (req) => {
  const {
    serviceName,
    serviceCode,
    serviceType,
    serviceStatus,
    caseOpened,
    caseClosed,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
    description
  } = req.body;

  if (!serviceName || !serviceCode || !serviceType || !serviceStatus) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.missingRequiredFields,
      errorCodes.bad_request
    );
  }

  const caseData = {
    serviceName,
    serviceCode,
    serviceType,
    serviceStatus,
    caseOpened,
    caseClosed,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
    description
  };

  // Add file path if a file is uploaded
  if (req.file && req.file.filename) {
    caseData.file = `uploads/${req.file.filename}`;
  }

  const newCase = await Case.create(caseData);

  if (!newCase) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.notCreated || "Case creation failed",
      errorCodes.bad_request
    );
  }

  return { newCase };
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
  const { serviceName, serviceStatus, serviceType, caseOpened } = req.query;

  const searchQuery = {
    isDeleted: false 
  };

  if (serviceName) {
    searchQuery.serviceName = { $regex: serviceName, $options: 'i' };
  }

  if (serviceStatus) {
    searchQuery.serviceStatus = { $regex: serviceStatus, $options: 'i' };
  }

  if (serviceType) {
    searchQuery.serviceType = { $regex: serviceType, $options: 'i' };
  }

  if (caseOpened) {
    searchQuery.caseOpened = { $gte: new Date(caseOpened) }; 
  }

  const cases = await Case.find(searchQuery).sort({ createdAt: -1 });

  if (!cases.length) {
    return res.status(404).json({
      success: false,
      message: 'No cases found matching your criteria.',
    });
  }

  return res.status(200).json(cases);
}

export const getCaseById = async (req) => {
  const caseId = req?.params.id

  if (!caseId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const caseData = await Case.findOne({ _id: caseId, isDeleted: false })
  if (!caseData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.caseNotFound,
      errorCodes?.user_not_found
    )
  }
  return { caseData }
}

export const getAllCases = async () => {
  const allService = await Case.find({ isDeleted: false }).sort({
    createdAt: -1,
  })
  if (!allService) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allService }
}
