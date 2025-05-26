import * as dashboardService from '../services/dashboard.js'
import { statusCodes } from '../core/common/constant.js'

export const getAllDonationTotal = async (req, res) => {
  const allMail = await dashboardService.getAllDonationTotal()
  res.status(statusCodes?.ok).send(allMail)
}
