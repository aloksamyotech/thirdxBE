import * as session from '../services/session.js'
import { statusCodes } from '../core/common/constant.js'

export const addSession = async (req, res) => {
  const {
    serviceuser,
    country,
    description,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    time,
    date,
    fundraisingActivities,
    serviceId,
  } = req.body

  const sessionData = {
    serviceuser,
    country,
    description,
    benificiary,
    campaigns,
    engagement,
    time,
    date,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
    serviceId,
  }

  if (req.file && req.file.filename) {
    sessionData.file = `${req.file.filename}`
  }

  const addServices = await session.addSession(sessionData)
  res.status(statusCodes?.ok).send(addServices)
}

export const deleteSession = async (req, res) => {
  const sessionId = req.params.id
  const deletedServices = await session.deleteSession(sessionId)
  res.status(statusCodes?.ok).send(deletedServices)
}

export const searchSession = async (req, res) => {
  const { name, isActive, type } = req.query
  const searchData = await session.searchSession(name, isActive, type)
  res.status(statusCodes?.ok).send(searchData)
}

export const getSessionById = async (req, res, next) => {
  const serviceId = req?.params.id
  const searchData = await session.getSessionById(serviceId)
  res.status(statusCodes?.ok).send(searchData)
}

export const getAllSession = async (req, res) => {
  const searchData = await session.getAllSession()
  res.status(statusCodes?.ok).send(searchData)
}

export const editSession = async (req, res) => {
  const id = req.params.id
  const {
    name,
    country,
    description,
    benificiary,
    campaigns,
    engagement,
    eventAttanded,
    fundingInterest,
    time,
    date,
    fundraisingActivities,
    serviceId,
  } = req.body

  const sessionData = {
    name,
    country,
    description,
    benificiary,
    campaigns,
    engagement,
    time,
    date,
    eventAttanded,
    fundingInterest,
    fundraisingActivities,
    serviceId,
  }

  if (req.file && req.file.filename) {
    sessionData.file = `${req.file.filename}`
  }

  const editSession = await session.editSession(id, sessionData)
  res.status(statusCodes?.ok).send(editSession)
}

export const getAllWithPagination = async (req, res) => {
  const searchData = await session.getAllWithPagination(req?.query)
  res.status(statusCodes?.ok).send(searchData)
}
