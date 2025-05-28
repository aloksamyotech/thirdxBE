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
  const { id } = req?.params
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
  }
  const updateAdmin = await adminService.editAdmin(adminData)
  res.status(statusCodes?.ok).send(updateAdmin)
}
export const getAdminById = async (req, res) => {
  const { id } = req?.params
  const getAdminData = await adminService.getAdminById(id)
  res.status(statusCodes?.ok).send(getAdminData)
}
