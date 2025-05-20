import CaseNote from '../models/caseNote.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'

export const createCaseNote = async (caseNoteData) => {
  const { caseId, date, configurationId, subject, note, filePath, time } =
    caseNoteData

  if (!caseId || !date || !configurationId || !subject) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.missingRequiredFields,
      errorCodes.invalid_input
    )
  }

  const newCaseNote = await CaseNote.create({
    caseId,
    date,
    configurationId,
    subject,
    note: note || '',
    file: filePath || '',
    time,
  })

  return newCaseNote
}

export const editCaseNote = async (caseNoteId, caseNoteData, filePath) => {
  const updateObj = { ...caseNoteData }

  if (filePath) {
    updateObj.file = filePath
  }

  const updatedNote = await CaseNote.findByIdAndUpdate(
    caseNoteId,
    { $set: updateObj },
    {
      new: true,
      runValidators: true,
    }
  )

  if (!updatedNote) {
    throw new CustomError(
      statusCodes.notFound,
      Message.notFound,
      errorCodes.not_found
    )
  }

  return updatedNote
}

export const getCaseNoteById = async (caseNoteId) => {
  if (!caseNoteId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const caseNoteData = await CaseNote.findOne({
    _id: caseNoteId,
    isDeleted: false,
  })
  if (!caseNoteData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return { caseNoteData }
}

export const getAllCaseNote = async () => {
  const allCaseNote = await CaseNote.find({ isDeleted: false }).sort({
    createdAt: -1,
  })
  if (!allCaseNote) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allCaseNote }
}

export const getAllWithPagination = async (query) => {
  const { search, page = 1, limit = 10 } = query || {}
  let pageNumber = Number(page)
  let limitNumber = Number(limit)
  if (pageNumber < 1) {
    pageNumber = 1
  }

  if (limitNumber < 1) {
    limitNumber = 10
  }
  const skip = (pageNumber - 1) * limitNumber

  const searchKeys = {
    subject: search,
  }

  const filter = {
    ...regexFilter(searchKeys),
  }

  const allCaseNote = await CaseNote.find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })

  const total = await CaseNote.countDocuments(filter)
  return {
    data: allCaseNote,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}

export const deleteCaseNote = async (caseNoteId) => {
  const serviceData = await CaseNote.findById(caseNoteId)

  if (!serviceData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const caseNoteUpdate = await CaseNote.findByIdAndUpdate(
    caseNoteId,
    { isDeleted: true },
    { new: true }
  )

  if (!caseNoteUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    )
  }
  return { caseNoteUpdate }
}
