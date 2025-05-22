import * as cases from '../services/case.js'
import { statusCodes } from '../core/common/constant.js'

export const addCase = async (req, res) => {
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
  } = req.body

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

  const filePath = req?.file?.path?.replace(/\\/g, '/')

  if (filePath) caseData.file = `${filePath}`

  const addCases = await cases.addCase(caseData)
  res.status(statusCodes?.ok).send(addCases)
}

export const deleteCase = async (req, res) => {
  const caseId = req.params.id
  const deletedServices = await cases.deleteCase(caseId)
  res.status(statusCodes?.ok).send(deletedServices)
}

export const searchCase = async (req, res) => {
  const { serviceId, serviceStatus, serviceType, caseOpened } = req.query
  const query = {
    serviceId,
    serviceStatus,
    serviceType,
    caseOpened,
  }
  const searchData = await cases.searchCase(query)
  res.status(statusCodes.ok).send(searchData)
}

export const getCaseById = async (req, res) => {
  const caseId = req?.params?.id
  const searchData = await cases.getCaseById(caseId)
  res.status(statusCodes?.ok).send(searchData)
}

export const getAllCases = async (req, res) => {
  const searchData = await cases.getAllCases()
  res.status(statusCodes?.ok).send(searchData)
}

export const editCase = async (req, res) => {
  const { caseId } = req.params.caseId
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
  } = req.body

  const filePath = req?.file?.path

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
  if (filePath) caseData.file = `${filePath}`

  const editCase = await cases.editCase(caseId, caseData)
  res.status(statusCodes?.ok).send(editCase)
}

export const getCasewithPagination = async (req, res) => {
  const searchData = await cases.getCasewithPagination(req?.query)
  res.status(statusCodes?.ok).send(searchData)
}
