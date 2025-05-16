import mail from '../models/mail.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'

export const addMail = async (req) => {

    const data = req?.body || {}
    
    const newMail = await mail.create(data)
    if (!newMail) {
        return new CustomError(
            statusCodes?.badRequest,
            Message?.notCreated,
            errorCodes?.bad_request
        )
    }
    return { newMail }
}

export const getAllMail = async () => {

    const allMail = await mail.find().sort({ createdAt: -1 })
    if (!allMail) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.notFound,
            errorCodes?.not_found
        )
    }
    return { allMail }
}

export const filter = async (req) => {
    const { tag, name } = req?.query || {}

    let filter = {}
    if (tag) filter.tags = tag;
    if (name) filter.name = name

    const filterData = await mail.find(filter)

    return filterData
}

export const editMail = async (req) => {
    const { mailId } = req.params.mailId;
    const {name, tags, channelSettings, purposeSettings, includeArchived} = req.body;

     if (!mailId) {
        throw new CustomError(
          statusCodes?.badRequest,
          'Invalid Mail ID',
          errorCodes?.bad_request
        );
      }
    
      const existingMail = await mail.findById(mailId);
    
      if (!existingMail) {
        throw new CustomError(
          statusCodes?.notFound,
          Message?.notFound || 'Mail not found',
          errorCodes?.not_found
        );
      }
    const mailData = {
        name, tags, channelSettings, purposeSettings, includeArchived
      };

   const updatedMail = await mail.findByIdAndUpdate(mailId,
    {$set: mailData},
    {new : true}
   );
    if (!updatedMail) {
        throw new CustomError(
            statusCodes?.badRequest,
            Message?.notUpdated || 'Mail update failed',
            errorCodes?.bad_request
          );
    }
    return { updatedMail }
}

export const deleteMail = async (req) => {
  const mailId = req.params.mailId;
  const mailData = await mail.findById(mailId)

  if (!mailData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const mailUpdate = await mail.findByIdAndUpdate(
    mailId,
    { isDeleted: true },
    { new: true }
  )

  if (!mailUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    )
  }
  return { mailUpdate }
}
