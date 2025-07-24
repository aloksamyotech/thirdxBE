import Transaction from '../models/transaction.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import Session from '../models/session.js';
import user from '../models/user.js';
import Case from '../models/cases.js';
import Services from "../models/services.js"
import '../models/tags.js';
import task from '../models/task.js';
import path from 'path';
import { convertToReadableFormat } from '../utils/valueFormatter.js';
import dayjs from 'dayjs'

export const getAllDonationTotal = async () => {

  const result = await Transaction.aggregate([
    { $match: { isDelete: false, isCompletlyDelete: false, } },
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

  const result = await Session.find({ isDelete: false, isCompletlyDelete: false, })
  const totalSession = convertToReadableFormat(result.length);
  return { totalSession }

};
export const getAllActiveServiceUser = async () => {
  const result = await user.find({ role: "service_user", isDelete: false, isCompletlyDelete: false, })
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
    isCompletlyDelete: false,
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
    .populate({
      path: 'tags',
      model: 'tag',
      populate: {
        path: 'tagCategoryId',
        model: 'tagCategory'
      }
    })
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
  const cases = await Case.find({ isDelete: false, isArchive: false, isCompletlyDelete: false, });
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
    isDelete: false,
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
    { isDelete: true },
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
  const allTask = await task.find({ isDelete: false, isCompletlyDelete: false }).sort({
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
  const { assignedTo, isCompleted, notification, dueDate, page = 1, limit = 10, range, name } = query || {};
  let pageNumber = Number(page);
  let limitNumber = Number(limit);

  if (pageNumber < 1) pageNumber = 1;
  if (limitNumber < 1) limitNumber = 10;

  const skip = (pageNumber - 1) * limitNumber;
  const filter = {
    isDelete: false,
    isCompletlyDelete: false,
  };
  if (assignedTo) {
    filter.assignedTo = assignedTo;
  }
  if (notification !== undefined) {
    filter.notification = notification === 'true';
  }
  if (isCompleted !== undefined) {
    filter.isCompleted = isCompleted === 'true';
  }
  if (range && !dueDate) {
    let startDate;
    const endDate = dayjs().endOf('day');
    switch (range) {
      case 'this-week':
        startDate = dayjs().startOf('week');
        break;
      case 'this-month':
        startDate = dayjs().startOf('month');
        break;
      case 'this-year':
        startDate = dayjs().startOf('year');
        break;
      default:
        startDate = null;
    }
    if (startDate) {
      filter.createdAt = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      };
    }
  }
  if (dueDate) {
    const startOfDay = new Date(dueDate);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);
    filter.dueDate = {
      $gte: startOfDay,
      $lt: endOfDay,
    };
  }
  let query_builder = task.find(filter);
  if (name && name.trim()) {
    query_builder = query_builder.populate({
      path: 'assignedTo',
      match: { userName: { $regex: name.trim(), $options: 'i' } }
    });
  } else {
    query_builder = query_builder.populate('assignedTo');
  }
  const totalQuery = task.find(filter);
  let total;

  if (name && name.trim()) {
    const allTasksForCount = await totalQuery.populate({
      path: 'assignedTo',
      match: { userName: { $regex: name.trim(), $options: 'i' } }
    });
    total = allTasksForCount.filter(task => task.assignedTo !== null).length;
  } else {
    total = await task.countDocuments(filter);
  }

  let allTasks = await query_builder
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 });
  if (name && name.trim()) {
    allTasks = allTasks.filter(task => task.assignedTo !== null);
  }

  return {
    data: allTasks,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};


export const getAllMediaAttachments = async (limit = 10) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const users = await user.find({
    isCompletlyDelete: false,
    updatedAt: { $gte: thirtyDaysAgo },
    $or: [
      { 'personalInfo.profileImage': { $ne: null } },
      { 'otherInfo.file': { $ne: null } }
    ]
  })
    .sort({ updatedAt: -1 })
    .select('personalInfo.firstName personalInfo.lastName personalInfo.profileImage otherInfo.file updatedAt')
    .lean();

  const userMedia = users.map(u => {
    const filePath = u.personalInfo?.profileImage || u.otherInfo?.file;
    return {
      type: 'user',
      name: `${u.personalInfo?.firstName || ''} ${u.personalInfo?.lastName || ''}`.trim(),
      file: filePath,
      fileName: path.basename(filePath),
      fileExtension: path.extname(filePath),
      date: new Date(u.updatedAt).toLocaleDateString(),
      time: new Date(u.updatedAt).toLocaleTimeString(),
    };
  });


  const services = await Services.find({
    isCompletlyDelete: false,
    updatedAt: { $gte: thirtyDaysAgo },
    $or: [
      { file: { $ne: null } },
      { attachment: { $ne: null } }
    ]
  })
    .sort({ updatedAt: -1 })
    .select('name file attachment updatedAt')
    .lean();

  const serviceMedia = services.map(s => {
    const filePath = s.file || s.attachment;
    return {
      type: 'service',
      name: s.name || 'Unnamed Service',
      file: filePath,
      fileName: path.basename(filePath),
      fileExtension: path.extname(filePath),
      date: new Date(s.updatedAt).toLocaleDateString(),
      time: new Date(s.updatedAt).toLocaleTimeString(),
    };
  });
  const cases = await Case.find({
    isCompletlyDelete: false,
    updatedAt: { $gte: thirtyDaysAgo },
    file: { $ne: null }
  })
    .sort({ updatedAt: -1 })
    .select('file uniqueId updatedAt')
    .lean();

  const caseMedia = cases.map(c => {
    return {
      type: 'case',
      name: `Case ID: ${c.uniqueId || 'Unnamed'}`,
      file: c.file,
      fileName: path.basename(c.file),
      fileExtension: path.extname(c.file),
      date: new Date(c.updatedAt).toLocaleDateString(),
      time: new Date(c.updatedAt).toLocaleTimeString(),
    };
  });
  const allMedia = [...userMedia, ...serviceMedia, ...caseMedia]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);

  return allMedia;
};


