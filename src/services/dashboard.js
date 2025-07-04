import Transaction from '../models/transaction.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'
import Session from '../models/session.js';
import user from '../models/user.js';
import Case from '../models/cases.js';
import task from '../models/task.js';
import path from 'path';
import { convertToReadableFormat } from '../utils/valueFormatter.js';
import dayjs from 'dayjs'

export const getAllDonationTotal = async () => {

  const result = await Transaction.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalAmountPaid: { $sum: '$amountPaid' },
      },
    },
  ]);
  const total = convertToReadableFormat(result[0]?.totalAmountPaid || 0);
  return { totalDonation: total }

};

export const getAllSessionDelivered = async () => {

  const result = await Session.find({ isDeleted: false })
  const totalSession = convertToReadableFormat(result.length);
  return { totalSession }

};


export const getAllActiveServiceUser = async () => {
  const result = await user.find({ role: "service_user", isDeleted: false })
  const totalUser = convertToReadableFormat(result.length);
  return { totalUser }
};

export const getAllCasesWithPagination = async (query) => {
  const {
    uniqueId,
    serviceUserId,
    serviceId,
    caseOwner,
    status,
    isArchive,
    caseOpened,
    page = 1,
    limit = 10,
    range,
  } = query || {}

  let pageNumber = Number(page)
  let limitNumber = Number(limit)
  if (pageNumber < 1) pageNumber = 1
  if (limitNumber < 1) limitNumber = 10

  const skip = (pageNumber - 1) * limitNumber

  const filter = {
    ...(uniqueId && { uniqueId }),
    ...(serviceUserId && { serviceUserId }),
    ...(serviceId && { serviceId }),
    ...(caseOwner && { caseOwner }),
    ...(status && { status }),
    ...(isArchive !== undefined && { isArchive: isArchive === 'true' }),
  }

  if (range && !caseOpened) {
    let startDate
    const endDate = dayjs().endOf('day')

    switch (range) {
      case 'this-week':
        startDate = dayjs().startOf('week')
        break
      case 'this-month':
        startDate = dayjs().startOf('month')
        break
      case 'this-year':
        startDate = dayjs().startOf('year')
        break
      default:
        startDate = null
    }

    if (startDate) {
      filter.createdAt = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      }
    }
  }

  if (caseOpened) {
    const startOfDay = new Date(caseOpened)
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)

    filter.caseOpened = {
      $gte: startOfDay,
      $lt: endOfDay,
    }
  }

  // 1. Get paginated cases
  const allCases = await Case.find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .populate('serviceUserId')
    .populate('serviceId')
    .populate('caseOwner')
    .populate('benificiary')
    .populate('campaigns')
    .populate('engagement')
    .populate('eventAttanded')
    .populate('fundingInterest')
    .populate('fundraisingActivities')

  // 2. Count total matching documents
  const total = await Case.countDocuments(filter)

  // 3. Aggregate count by status
  const statusCountsAggregation = await Case.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  // Convert aggregation result to an object for easier access
  const statusCounts = {
    pending: 0,
    open: 0,
    close: 0,
  }
  statusCountsAggregation.forEach(({ _id, count }) => {
    if (_id in statusCounts) {
      statusCounts[_id] = count
    }
  })

  return {
    data: allCases,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      statusCounts,  // counts of pending, open, close
    },
  }
}

export const getAllOpenCased = async () => {
  const cases = await Case.find({ isActive: true, isArchive: false });
  const totalcase = convertToReadableFormat(cases.length);
  return { totalcase };
};


export const createTask = async (data) => {
  const { details, assignedTo, dueDate, isCompleted, notification } = data;

  if (!assignedTo) {
    throw new CustomError(
      statusCodes.badRequest,
      Message.missingRequiredFields,
      errorCodes.invalid_input
    )
  }
  const newTask = new task({
    details,
    assignedTo,
    dueDate,
    isCompleted,
    notification,
  });

  const Task = await newTask.save();
  return Task;
};

export const editTask = async (taskId, taskData) => {
  const updateObj = { ...taskData };

  const updatedTask = await task.findByIdAndUpdate(
    taskId,
    { $set: updateObj },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedTask) {
    throw new CustomError(
      statusCodes.notFound,
      Message.notFound,
      errorCodes.not_found
    );
  }

  return updatedTask;
};


export const getTaskById = async (taskId) => {
  if (!taskId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const taskData = await task.findOne({
    _id: taskId,
    isDeleted: false,
  })
  if (!taskData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return { taskData }
}


export const deletetask = async (taskId) => {
  const Id = await task.findById(taskId)

  if (!Id) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const taskUpdate = await task.findByIdAndUpdate(
    Id,
    { isDeleted: true },
    { new: true }
  )

  if (!taskUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    )
  }
  return { taskUpdate }
}


export const getAllTask = async () => {
  const allTask = await task.find({ isDeleted: false }).sort({
    createdAt: -1,
  })
    .populate('assignedTo')
  if (!allTask) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allTask }
}




export const getAllTasksWithPagination = async (query) => {
  const {
    assignedTo,
    isCompleted,
    notification,
    dueDate,
    page = 1,
    limit = 10,
    range
  } = query || {}

  let pageNumber = Number(page)
  let limitNumber = Number(limit)
  if (pageNumber < 1) pageNumber = 1
  if (limitNumber < 1) limitNumber = 10

  const skip = (pageNumber - 1) * limitNumber

  const filter = {
    isDeleted: false,
    ...(assignedTo && { assignedTo }),
    ...(notification !== undefined && { notification: notification === 'true' }),
    ...(isCompleted !== undefined && { isCompleted: isCompleted === 'true' }),
  }

  if (range && !dueDate) {
    let startDate
    const endDate = dayjs().endOf('day')

    switch (range) {
      case 'this-week':
        startDate = dayjs().startOf('week')
        break
      case 'this-month':
        startDate = dayjs().startOf('month')
        break
      case 'this-year':
        startDate = dayjs().startOf('year')
        break
      default:
        startDate = null
    }

    if (startDate) {
      filter.createdAt = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate()
      }
    }
  }
  if (dueDate) {
    const startOfDay = new Date(dueDate)
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)

    filter.dueDate = {
      $gte: startOfDay,
      $lt: endOfDay
    }
  }

  const allTasks = await task.find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .populate('assignedTo')

  const total = await task.countDocuments(filter)

  return {
    data: allTasks,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}


export const getAllMediaAttachments = async (limit = 10) => {
  const usersWithFiles = await user.find({
    $or: [
      { 'personalInfo.profileImage': { $ne: null } },
      { 'otherInfo.file': { $ne: null } },
    ]
  })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .select('personalInfo.profileImage otherInfo.file updatedAt personalInfo.firstName personalInfo.lastName')
    .lean();

  const mediaList = usersWithFiles.map(user => {
    const filePath = user.personalInfo?.profileImage || user.otherInfo?.file;
    const fileName = filePath ? path.basename(filePath) : null;
    const fileExtension = filePath ? path.extname(filePath) : null;

    return {
      name: `${user.personalInfo?.firstName || ''} ${user.personalInfo?.lastName || ''}`.trim(),
      file: filePath,
      fileName,
      fileExtension,
      date: new Date(user.updatedAt).toLocaleDateString(),
      time: new Date(user.updatedAt).toLocaleTimeString(),
    };
  });

  return mediaList;
};