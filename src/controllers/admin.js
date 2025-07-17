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
  const { adminId } = req.params;
  const data = req.body;
  const result = await adminService.editAdmin(adminId, data);
  res.status(200).json({ success: true, updatedAdmin: result });
};

export const getAdminById = async (req, res) => {
  const { id } = req?.user
  const getAdminData = await adminService.getAdminById(id)
  res.status(statusCodes?.ok).send(getAdminData)
}

export const getAllAdmins = async (req, res) => {
  const getAdminData = await adminService.getAllAdmins()
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
export const forgotPassword = async (req, res) => {
  const { email } = req.body
  const response = await adminService.forgotPassword(email)
  res.status(statusCodes?.ok).send(response)
}

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body
  const response = await adminService.verifyOtp(email, otp)
  res.status(statusCodes?.ok).send(response)
}
export const resetPassword = async (req, res) => {
  const { token, newPassword, confirmNewPass } = req.body
  const adminData = {
    token,
    newPassword,
    confirmNewPass,
  }
  const response = await adminService.resetPassword(adminData)
  res.status(statusCodes?.ok).send(response)
}

export const createConfigUser = async (req, res) => {
  const data = req.body;
  const response = await adminService.createConfigUser(data);
  res.status(statusCodes?.ok).send(response);
}
export const deleteAdmin = async (req, res) => {
  const { adminId } = req.params;
  const result = await adminService.deleteAdmin(adminId);
  res.status(200).json({ success: true, message: "Admin deleted", data: result });
};


export const getUserWithPagination = async (req, res) => {
  try {
    const result = await adminService.getUsersWithPagination(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};
