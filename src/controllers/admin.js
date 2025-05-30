import { statusCodes } from '../core/common/constant.js'
import * as adminService from '../services/admin.js'

export const signUpAdmin = async (req, res) => {
  const { email, userName, password } = req?.body
  const adminData = {
    email,
    userName,
    password,
  }
  const createAdmin = await adminService.signUpAdmin(adminData)
  res.status(statusCodes?.ok).send(createAdmin)
}
export const loginAdmin = async (req, res) => {
  const { email, password } = req?.body
  const adminData = {
    email,
    password,
  }
  const loginAdmin = await adminService.adminLogin(adminData)
  res.status(statusCodes?.ok).send(loginAdmin)
}
export const editAdmin = async (req, res) => {
  const file = req?.file?.path
  const { id } = req?.user
  const {
    firstName,
    lastName,
    email,
    organization,
    phoneNumber,
    address,
    state,
    zipCode,
    country,
    language,
    status,
    currency,
    userName,
  } = req?.body
  const adminData = {
    firstName,
    lastName,
    email,
    organization,
    phoneNumber,
    address,
    state,
    zipCode,
    country,
    language,
    status,
    currency,
    userName,
    id,
    file,
  }
  const updateAdmin = await adminService.editAdmin(adminData)
  res.status(statusCodes?.ok).send(updateAdmin)
}
export const getAdminById = async (req, res) => {
  const { id } = req?.user
  const getAdminData = await adminService.getAdminById(id)
  res.status(statusCodes?.ok).send(getAdminData)
}

export const getAllAdmins = async (req, res) => {
  const { id } = req?.user
  const getAdminData = await adminService.getAllAdmins(id)
  res.status(statusCodes?.ok).send(getAdminData)
}

export const changePassword = async (req, res) => {
  const { password, newPassword } = req?.body
  const { id } = req?.user
  const adminData = {
    id,
    password,
    newPassword,
  }
  const changePass = await adminService.changePassword(adminData)
  res.status(statusCodes?.ok).send(changePass)
}

export const googleSignin = async (req, res) => {
  const { access_token } = req.body
  const response = await adminService.googleAuth(access_token)
  res.status(statusCodes?.ok).send(response)
}
