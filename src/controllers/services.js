import * as services from '../services/services.js'
import { statusCodes } from '../core/common/constant.js'

export const addServices = async (req, res) => {
  const {
    name,
    code,
    isActive,
    type,
    description,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
  } = req.body

  const serviceData = {
    name,
    code,
    isActive,
    type,
    description,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
  }

  if (req.file && req.file.filename) {
    serviceData.file = `${req.file.filename}`
  }
  const addServices = await services.addServices(serviceData)
  res.status(statusCodes?.ok).send(addServices)
}

export const deleteServices = async (req, res) => {
  const serviceId = req.params.id;
  const deletedServices = await services.deleteServices(serviceId)
  res.status(statusCodes?.ok).send(deletedServices)
}

export const searchServices = async (req, res) => {
  const { name, isActive, type } = req.query
  const queryData = {
    name, isActive, type
  }
  const searchData = await services.searchServices(queryData)
  res.status(statusCodes?.ok).send(searchData)
}

export const getServiceById = async (req, res) => {
  const serviceId = req?.params.id
  const searchData = await services.getServiceById(serviceId)
  res.status(statusCodes?.ok).send(searchData)
}

export const getAllServices = async (req, res) => {
  const searchData = await services.getAllServices()
  res.status(statusCodes?.ok).send(searchData)
}

export const editServices = async (req, res) => {
  const { serviceId } = req.params.serviceId;

  const {
    name,
    code,
    isActive,
    type,
    description,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
  } = req.body;

  const serviceData = {
    name,
    code,
    isActive,
    type,
    description,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
  };

  if (req.file && req.file.filename) {
    serviceData.file = req.file.filename;
  }

  const editServices = await services.editServices(serviceId, serviceData)
  res.status(statusCodes?.ok).send(editServices)
}
