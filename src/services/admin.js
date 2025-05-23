import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import Admin from '../models/admin.js'
import CustomError from '../utils/exception.js'
import { hashPassword } from '../utils/password.js'

export const signUpAdmin = async (adminData) => {
  const findAdmin = await Admin.findOne({ email: adminData?.email })
  if (findAdmin) {
    return new CustomError(
      statusCodes?.conflict,
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

export const adminLogin = async (adminData) =>{
    
}


