import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import Admin from '../models/admin.js'
import CustomError from '../utils/exception.js'
import { comparePassword, hashPassword } from '../utils/password.js'
import jwt from 'jsonwebtoken'

export const signUpAdmin = async (adminData) => {
  const findAdmin = await Admin.findOne({ email: adminData?.email })
  if (findAdmin) {
    return new CustomError(
      statusCodes?.notFound,
      Message?.emailAlreadyRegistered,
      errorCodes?.user_exists
    )
  }
  const hashedPass = await hashPassword(adminData?.password)
  const createAdmin = await Admin.create({ ...adminData, password: hashedPass })

  if (!createAdmin) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
  return { createAdmin }
}

export const adminLogin = async (adminData) => {
  const findAdmin = await Admin.findOne({ email: adminData?.email })
  if (!findAdmin) {
    return new CustomError(
      statusCodes?.notFound,
      Message?.emailAlreadyRegistered,
      errorCodes?.user_exists
    )
  }
  const isMatch = await comparePassword(
    adminData?.password,
    findAdmin?.password
  )
  if (!isMatch) {
    return new CustomError(
      statusCodes?.unauthorized,
      Message?.wrongPassword,
      errorCodes?.unauthorized_access
    )
  }
  const token = jwt.sign(
    { id: findAdmin?._id, email: findAdmin?.email },
    process.env.JWT_SECRET
  )

  return { token }
}
