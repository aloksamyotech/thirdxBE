import * as casesNote from '../services/caseNote.js'
import { statusCodes } from '../core/common/constant.js'
import CaseNote from '../models/caseNote.js'
 
export const addCaseNote = async (req, res) => {
  const {
    caseId,
    date,
    configurationId,
    subject,
    note
  } = req.body

  const filePath = req?.file?.path

   const caseNoteData = {
    caseId,
    date,
    configurationId,
    subject,
    note,
    filePath
  }
   const addCases = await casesNote.createCaseNote(caseNoteData)
   res.status(statusCodes?.ok).send(addCases);
}
 
export const deleteCaseNote = async (req, res) => {
    const caseNoteId = req.params.id
  const deletedServices = await casesNote.deleteCaseNote(caseNoteId)
  res.status(statusCodes?.ok).send(deletedServices)
}
 
// export const searchCase = async (req, res, next) => {
//     const searchData = await cases.searchCase(req.query);
//     res.status(statusCodes.ok).send(searchData);
// };
 
export const getCaseNoteById = async (req, res) => {
    const caseNoteId = req?.params?.id
    const searchData = await casesNote.getCaseNoteById(caseNoteId)
  res.status(statusCodes?.ok).send(searchData)
}
 
export const getAllCaseNote = async (req, res) => {

   const { search, status, page, limit } = req.query;
    
    const result = await casesNote.getAllCaseNote({
      search,
      status,
      page,
      limit
    });

    res.status(statusCodes.ok).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
}

export const editCaseNote = async (req, res) => {
   const {
    caseId,
    date,
    configurationId,
    subject,
    note
  } = req.body
    const { caseNoteId } = req.params;
   const caseNoteData = {
    caseId,
    date,
    configurationId,
    subject,
    note,
    filePath
  }
  const filePath = req?.file?.path
  const editCase = await casesNote.editCaseNote(caseNoteId,caseNoteData,filePath)

  res.status(statusCodes?.ok).send(editCase)
}
 