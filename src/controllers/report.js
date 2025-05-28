import { statusCodes } from '../core/common/constant.js'
import * as report from '../services/report.js'

export const getUserServiceReport = async (req, res) => {
  const userServiceReport = await report.getUserServiceReport()
  res.status(statusCodes?.ok).send(userServiceReport)
}

export const getCaseContactReport = async (req, res) => {
  const caseContactReport = await report.getCaseContactReport()
  res.status(statusCodes?.ok).send(caseContactReport)
}

export const getSessionContactReport = async (req, res) => {
  const sessionContactReport = await report.getSessionContactReport()
  res.status(statusCodes?.ok).send(sessionContactReport)
}

export const getDonorReport = async (req, res) => {
  const donorReport = await report.getDonorReport()
  res.status(statusCodes?.ok).send(donorReport)
}
