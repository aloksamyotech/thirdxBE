import CaseNote from '../models/caseNote.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'
import mongoose from 'mongoose'
import Case from '../models/cases.js'
import UserTimeline from '../models/userTimeline.js'

export const createCaseNote = async (caseNoteData) => {
  const {
    caseId,
    date,
    configurationId,
    subject,
    note,
    filePath,
    time,
    createdBy,
  } = caseNoteData

  if (!caseId || !date || !configurationId || !subject || !createdBy) {
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
    createdBy,
  });

  const caseData = await Case.findById(caseId);

  await UserTimeline.findOneAndUpdate(
    { userId: caseData?.serviceUserId },
    { $addToSet: { caseNoteId: newCaseNote._id } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

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
    );
  }

  const caseNoteData = await CaseNote.findOne({
    _id: caseNoteId,
    isDelete: false,
  })
    .populate('configurationId')
    .populate('createdBy')
    .populate('caseId');

  if (!caseNoteData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    );
  }

  return { caseNoteData };
};


export const getAllCaseNote = async () => {
  const allCaseNote = await CaseNote.find({ isDelete: false, isCompletlyDelete: false }).sort({
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
  const { search, caseId, page = 1, limit = 10, date, createdBy, deleted, } = query || {}
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
    isArchive: false,
    ...(typeof deleted !== 'undefined' ? { isDelete: deleted === 'true' } : { isDelete: false }),
    isCompletlyDelete: false,
    ...regexFilter(searchKeys),
    ...(caseId !== undefined &&
      caseId !== '' && { caseId: new mongoose.Types.ObjectId(caseId) }),
    ...(createdBy !== undefined &&
      createdBy !== '' && {
      createdBy: new mongoose.Types.ObjectId(createdBy),
    }),
    ...(date !== undefined &&
      date !== '' && {
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      },
    }),
  }

  const allCaseNote = await CaseNote.find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .populate('configurationId')
    .populate('createdBy')

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
    { isDelete: true },
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


export const toggleArchiveCaseNote = async (sessionId, isArchive = true, archiveReason = null) => {
  const checkExist = await CaseNote.findById(sessionId);

  if (!checkExist) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    );
  }

  const statusUpdate = await CaseNote.findByIdAndUpdate(
    sessionId,
    {
      isArchive,
      archiveReason: isArchive ? archiveReason : null
    },
    { new: true }
  );

  if (!statusUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    );
  }

  return { statusUpdate };
};
