import * as services from '../services/services.js'
import { statusCodes } from '../core/common/constant.js'

export const addServices = async (req, res, next) => {
  const addServices = await services.addServices(req, res, next)
  res.status(statusCodes?.ok).send(addServices)
}

export const deleteServices = async (req, res, next) => {
  const deletedServices = await services.deleteServices(req, res, next)
  res.status(statusCodes?.ok).send(deletedServices)
}

export const searchServices = async (req, res, next) => {
  const searchData = await services.searchServices(req, res, next)
  res.status(statusCodes?.ok).send(searchData)
}

export const getServiceById = async (req, res, next) => {
  const searchData = await services.getServiceById(req, res, next)
  res.status(statusCodes?.ok).send(searchData)
}

export const getAllServices = async (req, res, next) => {
  const searchData = await services.getAllServices(req, res, next)
  res.status(statusCodes?.ok).send(searchData)
}
