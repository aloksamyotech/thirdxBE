import * as session from '../services/session.js'
import { statusCodes } from '../core/common/constant.js'

export const addSession = async (req, res, next) => {
  const addServices = await session.addSession(req, res, next)
  res.status(statusCodes?.ok).send(addServices)
}

export const deleteSession = async (req, res, next) => {
  const deletedServices = await session.deleteSession(req, res, next)
  res.status(statusCodes?.ok).send(deletedServices)
}

export const searchSession = async (req, res, next) => {
  const searchData = await session.searchSession(req, res, next)
  res.status(statusCodes?.ok).send(searchData)
}

export const getSessionById = async (req, res, next) => {
  const searchData = await session.getSessionById(req, res, next)
  res.status(statusCodes?.ok).send(searchData)
}

export const getAllSession = async (req, res, next) => {
  const searchData = await session.getAllSession(req, res, next)
  res.status(statusCodes?.ok).send(searchData)
}
