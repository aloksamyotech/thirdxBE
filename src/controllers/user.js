import * as userService from '../services/user.js'
import { statusCodes } from '../core/common/constant.js'

export const addUser = async (req, res, next) => {
  const addUser = await userService.addUser(req, res, next)
  res.status(statusCodes?.ok).send(addUser)
}

export const getAllUser = async (req, res, next) => {
  const getAllUser = await userService.getAllUser(req, res, next)
  res.status(statusCodes?.ok).send(getAllUser)
}

export const getUserById = async (req, res, next) => {
  const getUserById = await userService.getUserById(req, res, next)
  res.status(statusCodes?.ok).send(getUserById)
}

export const getAllUsDistricts = async (req, res, next) => {
  const getUserDistricts = await userService.getAllUsDistricts(req, res, next)
  res.status(statusCodes?.ok).send(getUserDistricts);
}

