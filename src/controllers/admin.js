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
