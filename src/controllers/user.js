import * as userService from '../services/user.js'
import { statusCodes } from '../core/common/constant.js'

export const addUser = async (req, res) => {
  const userData = req?.body || {}
  const filePath = req?.file?.path
  if (filePath) {
    userData.otherInfo = {}
    userData.otherInfo.file = `${filePath}`
  }
  const addUser = await userService.addUser(userData)
  res.status(statusCodes?.ok).send(addUser)
}

export const getAllUser = async (req, res) => {
  const getAllUser = await userService.getAllUser()
  res.status(statusCodes?.ok).send(getAllUser)
}

export const getAllVolunteer = async (req, res) => {
  const getAllVolunteer = await userService.getAllVolunteer()
  res.status(statusCodes?.ok).send(getAllVolunteer)
}

export const getAllDonor = async (req, res) => {
  const getAllDonor = await userService.getAllDonor()
  res.status(statusCodes?.ok).send(getAllDonor)
}

export const getUserById = async (req, res) => {
  const { userId } = req?.params || {}

  const getUserById = await userService.getUserById(userId)
  res.status(statusCodes?.ok).send(getUserById)
}

export const getAllUsDistricts = async (req, res) => {
  const getUserDistricts = await userService.getAllUsDistricts()
  res.status(statusCodes?.ok).send(getUserDistricts)
}

export const editUser = async (req, res) => {
  const { userId } = req.params
  const userData = req?.body || {}
  const filePath = req?.file?.path

  if (filePath) {
    if (!userData.otherInfo) {
      userData.otherInfo = {}
    }
    userData.otherInfo.file = `uploads/${filePath}`
  }
  userData.userId = userId

  const addUser = await userService.editUser(userData)
  res.status(statusCodes?.ok).send(addUser)
}

export const deleteUser = async (req, res) => {
  const { userId } = req?.params || {}

  const deleteUser = await userService.deleteUser(userId)
  res.status(statusCodes?.ok).send(deleteUser)
}
