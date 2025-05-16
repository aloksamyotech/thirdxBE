import * as cases from '../services/case.js'
import { statusCodes } from '../core/common/constant.js'
 
export const addCase = async (req, res, next) => {
  const addCases = await cases.addCase(req, res, next)
  res.status(statusCodes?.ok).send(addCases)
}
 
export const deleteCase = async (req, res, next) => {
  const deletedServices = await cases.deleteCase(req, res, next)
  res.status(statusCodes?.ok).send(deletedServices)
}
 
export const searchCase = async (req, res, next) => {
    const searchData = await cases.searchCase(req.query);
    res.status(statusCodes.ok).send(searchData);
};
 
export const getCaseById = async (req, res, next) => {
  const searchData = await cases.getCaseById(req, res, next)
  res.status(statusCodes?.ok).send(searchData)
}
 
export const getAllCases = async (req, res, next) => {
  const searchData = await cases.getAllCases(req, res, next)
  res.status(statusCodes?.ok).send(searchData)
}

export const editCase = async (req, res, next) => {
  const editCase = await cases.editCase(req, res, next)
  res.status(statusCodes?.ok).send(editCase)
}
 