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

export const getAllVolunteer = async (req, res, next) => {
  const getAllVolunteer = await userService.getAllVolunteer(req, res, next)
  res.status(statusCodes?.ok).send(getAllVolunteer)
}

export const getAllDonor = async (req, res, next) => {
  const getAllDonor = await userService.getAllDonor(req, res, next)
  res.status(statusCodes?.ok).send(getAllDonor)
}

export const getUserById = async (req, res, next) => {
  const getUserById = await userService.getUserById(req, res, next)
  res.status(statusCodes?.ok).send(getUserById)
}

export const getAllUsDistricts = async (req, res, next) => {
  const getUserDistricts = await userService.getAllUsDistricts(req, res, next)
  res.status(statusCodes?.ok).send(getUserDistricts);
}

export const editUser = async (req, res, next) => {
  const addUser = await userService.editUser(req, res, next)
  res.status(statusCodes?.ok).send(addUser)
}

export const deleteUser = async (req, res, next) => {
  const deleteUser = await userService.deleteUser(req, res, next)
  res.status(statusCodes?.ok).send(deleteUser)
}