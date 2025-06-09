import * as userService from '../services/user.js'
import { Message, statusCodes } from '../core/common/constant.js'
import user from '../models/user.js'
import fs from 'fs'
import path from 'path'

export const addUser = async (req, res) => {
  const userData = req?.body || {}
  const files = req?.files || {}

  if (files?.file?.[0]?.path) {
    const normalizedPath = files.file[0].path.replace(/\\/g, '/')
    userData.otherInfo = userData.otherInfo || {}
    userData.otherInfo.file = normalizedPath
  }

  if (files?.profileImage?.[0]?.path) {
    const normalizedProfileImage = files.profileImage[0].path.replace(
      /\\/g,
      '/'
    )
    userData.personalInfo = userData.personalInfo || {}
    userData.personalInfo.profileImage = normalizedProfileImage
  }

  const addUser = await userService.addUser(userData)
  res.status(statusCodes?.ok).send(addUser)
}

export const getAllServiceUser = async (req, res) => {
  const getAllUser = await userService.getAllServiceUser()
  res.status(statusCodes?.ok).send(getAllUser)
}

export const getAllVolunteer = async (req, res) => {
  const getAllVolunteer = await userService.getAllVolunteer()
  res.status(statusCodes?.ok).send(getAllVolunteer)
}
export const getAllUsers = async (req, res) => {
  const getAllVolunteer = await userService.getAllUsers()
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

  const existingUser = await user.findById(userId)

  if (!existingUser) {
    return res.status(statusCodes?.notFound).send({
      message: Message.userNotFound,
    })
  }

  if (filePath) {
    const oldImagePath = existingUser?.otherInfo?.file

    if (oldImagePath && fs.existsSync(path.join(process.cwd(), oldImagePath))) {
      fs.unlinkSync(path.join(process.cwd(), oldImagePath))
    }

    if (!userData.otherInfo) userData.otherInfo = {}
    userData.otherInfo.file = `${filePath}`
  } else {
    if (!userData.otherInfo) userData.otherInfo = {}
    userData.otherInfo.file = existingUser?.otherInfo?.file
  }
  userData.userId = userId

  const result = await userService.editUser(userData)
  return res.status(statusCodes?.ok).send(result)
}

export const deleteUser = async (req, res) => {
  const { userId } = req?.params || {}

  const deleteUser = await userService.deleteUser(userId)
  res.status(statusCodes?.ok).send(deleteUser)
}

export const archiveUser = async (req, res) => {
  const { userId } = req?.params || {}
  const { archiveReason } = req.body
  const archiveUser = await userService.archiveUser(userId, archiveReason)
  res.status(statusCodes?.ok).send(archiveUser)
}
export const editArchiveVolunteer = async (req, res) => {
  const { userId } = req?.params || {}
  const editArchiveVolunteer = await userService.editArchiveVolunteer(userId)
  res.status(statusCodes?.ok).send(editArchiveVolunteer)
}

export const getUserwithPagination = async (req, res) => {
  const searchData = await userService.getUserwithPagination(req?.query)
  res.status(statusCodes?.ok).send(searchData)
}

export const unArchiveUser = async (req, res) => {
  const { userId } = req?.params || {}

  const deleteUser = await userService.unArchiveUser(userId)
  res.status(statusCodes?.ok).send(deleteUser)
}
