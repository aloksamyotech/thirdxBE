import { regexFilter } from '../core/common/common.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import Attendees from '../models/attendees.js'
import CustomError from '../utils/exception.js'
import { isExistSession } from './session.js'
import { isExistUser } from './user.js'
import user from '../models/user.js'
import Case from '../models/cases.js'
import Session from '../models/session.js'

export const getUserServiceReport = async () => {
  const monthlyResult = await user.aggregate([
    {
      $match: {
        archive: false,
        isActive: true,
        isDeleted: false,
        role: 'user',
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
      },
    },
    {
      $group: {
        _id: '$month',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])

  const totalUser = await user.countDocuments({ archive: false })

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const formatted = {}
  for (let i = 0; i < 12; i++) {
    formatted[monthNames[i]] = 0
  }

  monthlyResult.forEach(({ _id, count }) => {
    formatted[monthNames[_id - 1]] = count
  })

  return {
    monthlyReport: formatted,
    totalUser: totalUser,
  }
}

export const getCaseContactReport = async () => {
  const currentYear = new Date().getFullYear()

  const data = await Case.aggregate([
    {
      $match: {
        caseOpened: { $ne: null },
        isArchive: false,
        isActive: true,
        isDeleted: false,
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$caseOpened' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const formattedData = monthNames.map((month, index) => {
    const monthData = data.find((item) => item._id === index + 1)
    return {
      month,
      count: monthData ? monthData.count : 0,
    }
  })

  return {
    data: formattedData,
  }
}

export const getSessionContactReport = async () => {
  const currentYear = new Date().getFullYear()

  const data = await Session.aggregate([
    {
      $match: {
        isArchive: false,
        isActive: true,
        isDeleted: false,
        date: {
          $gte: new Date(`${currentYear}-01-01`),
          $lte: new Date(`${currentYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$date' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const formattedData = monthNames.map((month, index) => {
    const monthData = data.find((item) => item._id === index + 1)
    return {
      month,
      count: monthData ? monthData.count : 0,
    }
  })

  return { data: formattedData }
}

export const getDonorReport = async () => {
  const monthlyResult = await user.aggregate([
    {
      $match: {
        archive: false,
        isActive: true,
        isDeleted: false,
        role: 'donor',
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
      },
    },
    {
      $group: {
        _id: '$month',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])

  const totalUser = await user.countDocuments({ archive: false })

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const formatted = {}
  for (let i = 0; i < 12; i++) {
    formatted[monthNames[i]] = 0
  }

  monthlyResult.forEach(({ _id, count }) => {
    formatted[monthNames[_id - 1]] = count
  })

  return {
    monthlyReport: formatted,
    totalUser: totalUser,
  }
}
