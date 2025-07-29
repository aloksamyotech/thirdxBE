import * as cases from '../services/case.js'
import { statusCodes } from '../core/common/constant.js'

export const addCase = async (req, res) => {
  const {
    serviceUserId,
    serviceId,
    caseOwner,
    caseOpened,
    caseClosed,
    tags,
    description,

  } = req.body
  const caseData = {
    serviceUserId,
    serviceId,
    caseOwner,
    caseOpened,
    caseClosed,
    tags: Array.isArray(tags) ? tags : tags ? [tags] : [],

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
  const { serviceId, serviceStatus, caseOwner, caseOpened } = req.query
  const query = {
    serviceId,
    serviceStatus,
    caseOwner,
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
  const { caseId } = req.params;
  const {
    serviceUserId,
    serviceId,
    caseOwner,
    caseOpened,
    caseClosed,
    tags,
    description,
    status,
  } = req.body;

  const filePath = req?.file?.path;

  const caseData = {
    serviceUserId,
    serviceId,
    caseOwner,
    caseOpened,
    caseClosed,
    tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
    description,
    status,
  };

  if (filePath) caseData.file = `${filePath}`;

  const editCase = await cases.editCase(caseId, caseData)
  res.status(statusCodes?.ok).send(editCase)
}

export const getCasewithPagination = async (req, res) => {
  const searchData = await cases.getCasewithPagination(req?.query)
  res.status(statusCodes?.ok).send(searchData)
}
export const toggleArchiveCase = async (req, res) => {
  const sessionId = req.params?.id;
  const { isArchive, archiveReason } = req.body;
  const data = await cases.toggleArchiveCase(sessionId, isArchive, archiveReason)
  res.status(statusCodes?.ok).send(data)
}

export const bulkUpload = async (req, res) => {
  const data = req.body;
  const response = await cases.bulkUpload(data);
  res.status(statusCodes?.ok).send(response);
}




export const getCasesByServiceUserId = async (req, res) => {
  const serviceUserId = req.params.id
  const dataFound = await cases.getCasesByServiceUserId(serviceUserId)
  res.status(statusCodes?.ok).send(dataFound)
}
