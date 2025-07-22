import * as services from '../services/services.js'
import { statusCodes } from '../core/common/constant.js'
export const addServices = async (req, res) => {

  const {
    name,
    code,
    isActive,
    serviceType,
    description,
    tags
  } = req.body;
  const serviceData = {
    name,
    code,
    isActive,
    serviceType,
    description,
    tags: Array.isArray(tags) ? tags : tags ? [tags] : []
  };

  if (req.files?.file?.[0]) {
    serviceData.file = `uploads/${req.files.file[0].filename}`
  }

  if (req.files?.attachment?.[0]) {
    serviceData.attachment = `uploads/${req.files.attachment[0].filename}`
  }
  const addServices = await services.addServices(serviceData)
  res.status(statusCodes?.ok).send(addServices)
}

export const deleteServices = async (req, res) => {
  const serviceId = req.params.id
  const deletedServices = await services.deleteServices(serviceId)
  res.status(statusCodes?.ok).send(deletedServices)
}

export const searchServices = async (req, res) => {
  const { name, isActive, type } = req.query
  const queryData = {
    name,
    isActive,
    type,
  }
  const searchData = await services.searchServices(queryData)
  res.status(statusCodes?.ok).send(searchData)
}

export const getServiceById = async (req, res) => {
  const serviceId = req?.params.id
  const searchData = await services.getServiceById(serviceId)
  res.status(statusCodes?.ok).send(searchData)
}

export const getServiceswithPagination = async (req, res) => {
  const searchData = await services.getServiceswithPagination(req?.query)
  res.status(statusCodes?.ok).send(searchData)
}

export const getAllServices = async (req, res) => {
  const searchData = await services.getAllServices(req?.query)
  res.status(statusCodes?.ok).send(searchData)
}

export const editServices = async (req, res) => {
  const serviceId = req.params.serviceId

  const {
    name,
    code,
    isActive,
    type,
    description,
    tags
  } = req.body

  const serviceData = {
    name,
    code,
    isActive,
    type,
    description,
    tags: Array.isArray(tags) ? tags : tags ? [tags] : []
  }

  if (req.file && req.file.filename) {
    serviceData.file = req.file.filename
  }

  const editServices = await services.editServices(serviceId, serviceData)
  res.status(statusCodes?.ok).send(editServices)
}
export const toggleArchiveSession = async (req, res) => {
  const sessionId = req.params?.id;
  const { isArchive, archiveReason } = req.body;
  const data = await services.toggleArchiveSession(sessionId, isArchive, archiveReason)
  res.status(statusCodes?.ok).send(data)
}
export const deleteSession = async (req, res) => {
  const sessionId = req.params?.id;
  const data = await services.deleteSession(sessionId)
  res.status(statusCodes?.ok).send(data)
}
export const bulkUpload = async (req, res) => {
  const data = req.body;
  const response = await services.bulkUpload(data);
  res.status(statusCodes?.ok).send(response);
}