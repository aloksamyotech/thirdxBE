import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import { verifyGoogleToken } from '../core/helpers/googleAuth.js'
import Admin from '../models/admin.js'
import CustomError from '../utils/exception.js'
import { comparePassword, hashPassword } from '../utils/password.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendOTP } from '../utils/mailer.js'

export const signUpAdmin = async (adminData) => {
  const findAdmin = await Admin.findOne({ email: adminData?.email })
  if (findAdmin) {
    return new CustomError(
      statusCodes.badRequest,
      Message.emailAlreadyRegistered,
      errorCodes.user_exists
    )
  }
  const hashedPass = await hashPassword(adminData?.password)
  const createAdmin = await Admin.create({ ...adminData, password: hashedPass })
  if (createAdmin) {
    createAdmin.createdBy = createAdmin._id
    createAdmin.updatedBy = createAdmin._id
    await createAdmin.save()
  }
  if (!createAdmin) {
    return new CustomError(
      statusCodes.badRequest,
      Message.notCreated,
      errorCodes.bad_request
    )
  }

  return { createAdmin }
}

export const adminLogin = async (adminData) => {
  const findAdmin = await Admin.findOne({ email: adminData?.email })

  if (!findAdmin) {
    return new CustomError(
      statusCodes.notFound,
      Message.emailNotRegistered,
      errorCodes.user_not_found
    )
  }

  const isMatch = await comparePassword(
    adminData?.password,
    findAdmin?.password
  )

  if (!isMatch) {
    return new CustomError(
      statusCodes.unauthorized,
      Message.wrongPassword,
      errorCodes.unauthorized_access
    )
  }
  const token = jwt.sign(
    { id: findAdmin?._id, email: findAdmin?.email, name: findAdmin?.userName },
    process.env.JWT_SECRET
  )

  return { token }
}
export const editAdmin = async (adminData) => {
  const { id, ...fieldsToUpdate } = adminData
  const updatedAdmin = await Admin.findByIdAndUpdate(
    id,
    { $set: fieldsToUpdate },
    { new: true }
  )
  if (!updatedAdmin) {
    return new CustomError(
      statusCodes.notFound,
      Message.notFound,
      errorCodes.not_found
    )
  }
  return { updatedAdmin }
}

export const getAdminById = async (id) => {
  const findAdmin = await Admin.findById(id)
  if (!findAdmin) {
    return new CustomError(
      statusCodes.notFound,
      Message.notFound,
      errorCodes.not_found
    )
  }
  return { findAdmin }
}

export const getAllAdmins = async () => {
  const allAdmins = await Admin.find()

  if (!allAdmins) {
    return new CustomError(
      statusCodes.notFound,
      Message.notFound,
      errorCodes.not_found
    )
  }

  return { allAdmins }
}

export const changePassword = async (adminData) => {
  const findAdmin = await Admin.findById(adminData?.id)
  if (!findAdmin) {
    return new CustomError(
      statusCodes.notFound,
      Message.notFound,
      errorCodes.not_found
    )
  }
  const isMatch = await comparePassword(
    adminData?.password,
    findAdmin?.password
  )
  if (!isMatch) {
    return new CustomError(
      statusCodes.unauthorized,
      Message.wrongPassword,
      errorCodes.unauthorized_access
    )
  }
  const hashedPass = await hashPassword(adminData?.newPassword)
  findAdmin.password = hashedPass
  findAdmin.updatedBy = adminData?.id
  await findAdmin.save()
  return { findAdmin }
}

export const googleAuth = async (access_token) => {
  if (!access_token) {
    return new CustomError(
      statusCodes.notFound,
      Message.AccessTokenRequired,
      errorCodes.bad_request
    )
  }

  const userInfo = await verifyGoogleToken(access_token)

  if (!userInfo) {
    return new CustomError(
      statusCodes.badRequest,
      Message.invalidGoogleToken,
      errorCodes.access_forbidden
    )
  }

  const AdminData = await Admin.findOne({ email: userInfo?.email })

  let token = null

  if (AdminData) {
    if (!AdminData.googleId) {
      await Admin.updateOne(
        { email: userInfo?.email },
        {
          googleId: userInfo?.sub,
        }
      )
    }

    token = jwt.sign(
      { id: AdminData?._id, email: AdminData?.email },
      process.env.JWT_SECRET
    )
  } else {
    const newAdmin = {
      firstName: userInfo?.given_name,
      lastName: userInfo?.family_name,
      email: userInfo?.email,
      userName: userInfo?.name,
      file: userInfo?.picture,
      googleId: userInfo?.sub,
    }

    const createAdmin = await Admin.create(newAdmin)
    if (createAdmin) {
      createAdmin.createdBy = createAdmin._id
      createAdmin.updatedBy = createAdmin._id
      await createAdmin.save()
    }

    token = jwt.sign(
      { id: createAdmin?._id, email: createAdmin?.email },
      process.env.JWT_SECRET
    )
  }

  return { token }
}

export const forgotPassword = async (email) => {
  const admin = await Admin.findOne({ email })
  if (!admin) {
    return new CustomError(
      statusCodes.notFound,
      Message.emailNotRegistered,
      errorCodes.user_not_found
    )
  }
  const otp = crypto.randomInt(100000, 999999).toString()
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000)
  admin.otp = otp
  admin.otpExpires = otpExpires
  await admin.save()
  await sendOTP(email, otp)
  return { otp }
}

export const verifyOtp = async (email, otp) => {
  const admin = await Admin.findOne({ email })
  if (!admin) {
    return new CustomError(
      statusCodes.notFound,
      Message.emailNotRegistered,
      errorCodes.user_not_found
    )
  }

  const now = new Date()
  if (admin?.otp !== otp || admin?.otpExpires < now)
    return new CustomError(
      statusCodes.badRequest,
      Message.InvalidOrExpired,
      errorCodes.not_found
    )

  const token = jwt.sign({ email }, process.env.JWT_SECRET)
  return { email, token }
}

export const resetPassword = async (adminData) => {
  const decoded = jwt.verify(adminData?.token, process.env.JWT_SECRET)
  const email = decoded.email
  const admin = await Admin.findOne({ email })
  if (!admin) {
    return new CustomError(
      statusCodes.notFound,
      Message.emailNotRegistered,
      errorCodes.user_not_found
    )
  }
  const hashedPassword = await hashPassword(adminData?.newPassword, 10)
  admin.password = hashedPassword
  admin.otp = null
  admin.otpExpires = null
  await admin.save()
  return { admin }
}
