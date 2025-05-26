import * as dashboardService from '../services/dashboard.js'
import { statusCodes } from '../core/common/constant.js'

export const getAllDonationTotal = async (req, res) => {
  const allMail = await dashboardService.getAllDonationTotal()
  res.status(statusCodes?.ok).send(allMail)
}

export const getAllSessionDelivered = async (req, res) => {
  const allMail = await dashboardService.getAllSessionDelivered()
  res.status(statusCodes?.ok).send(allMail)
}


export const getAllActiveServiceUser = async (req, res) => {
  const allMail = await dashboardService.getAllActiveServiceUser()
  res.status(statusCodes?.ok).send(allMail)
}

export const getAllOpenCased = async (req, res) => {
  const allMail = await dashboardService.getAllOpenCased()
  res.status(statusCodes?.ok).send(allMail)
}

