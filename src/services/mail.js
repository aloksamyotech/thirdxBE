import mail from '../models/mail.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'
import user from '../models/user.js'
import mongoose from 'mongoose'

export const addMail = async (data) => {
  const newMail = await mail.create(data)
  if (!newMail) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
  return { newMail }
}

export const getAllMail = async () => {
  const allMail = await mail.find({ isCompletlyDelete: false }).sort({ createdAt: -1 })
  if (!allMail) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allMail }
}

export const getMailDetailById = async (id, page = 1, limit = 10) => {
  const mailData = await mail.findById(id).lean();
  if (!mailData) throw new Error("Mail not found");

  const tagIds = mailData.tags.map(tag => new mongoose.Types.ObjectId(tag));
  const purposeIds = mailData.purposeSettings.map(p => new mongoose.Types.ObjectId(p));

  const channelMethodConditions = mailData.channelSettings.map(method => ({
    [`contactPreferences.contactMethods.${method}`]: true
  }));

  const filterMatchConditions = [];
  for (const filter of mailData.filters) {
    let condition;
    switch (filter.comparison) {
      case "equals":
        condition = { [filter.field]: filter.value };
        break;
      case "not_equals":
        condition = { [filter.field]: { $ne: filter.value } };
        break;
      case "contains":
        condition = { [filter.field]: { $regex: filter.value, $options: "i" } };
        break;
      case "not_contains":
        condition = { [filter.field]: { $not: { $regex: filter.value, $options: "i" } } };
        break;
      case "greater_than":
        condition = { [filter.field]: { $gt: filter.value } };
        break;
      case "less_than":
        condition = { [filter.field]: { $lt: filter.value } };
        break;
      default:
        throw new Error(`Unknown comparison operator: ${filter.comparison}`);
    }
    if (condition) {
      filterMatchConditions.push(condition);
    }
  }

  const skip = (page - 1) * limit;

  const matchStages = [
    {
      $match: {
        role: mailData.userType,
        isDelete: false,
        isCompletlyDelete: false,
        isArchive: { $ne: true },
        isActive: true
      }
    },
    {
      $match: {
        "otherInfo.tags": { $all: tagIds }
      }
    },
    {
      $match: {
        $or: channelMethodConditions
      }
    },
    {
      $match: {
        "contactPreferences.contactPurposes": {
          $elemMatch: { $in: purposeIds }
        }
      }
    }
  ];

  if (filterMatchConditions.length > 0) {
    matchStages.push({
      $match: {
        $and: filterMatchConditions
      }
    });
  }

  const users = await user.aggregate([
    ...matchStages,
    { $skip: skip },
    { $limit: limit }
  ]);

  const totalCountAgg = await user.aggregate([
    ...matchStages,
    { $count: "total" }
  ]);

  const total = totalCountAgg[0]?.total || 0;

  return {
    users,
    mailData,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const filter = async (tag, name) => {
  let filter = {}
  if (tag) filter.tags = tag
  if (name) filter.name = name

  const filterData = await mail.find(filter)

  return filterData
}

export const editMail = async (mailId, mailData) => {
  if (!mailId) {
    throw new CustomError(
      statusCodes?.badRequest,
      'Invalid Mail ID',
      errorCodes?.bad_request
    )
  }

  const existingMail = await mail.findById(mailId)

  if (!existingMail) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound || 'Mail not found',
      errorCodes?.not_found
    )
  }

  const updatedMail = await mail.findByIdAndUpdate(
    mailId,
    { $set: mailData },
    { new: true }
  )
  if (!updatedMail) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notUpdated || 'Mail update failed',
      errorCodes?.bad_request
    )
  }
  return { updatedMail }
}

export const deleteMail = async (mailId) => {
  const mailData = await mail.findById(mailId)

  if (!mailData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  const mailUpdate = await mail.findByIdAndUpdate(
    mailId,
    { isDelete: true },
    { new: true }
  )

  if (!mailUpdate) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notUpdate,
      errorCodes?.not_found
    )
  }
  return { mailUpdate }
}

export const getMailWithPagination = async (query) => {
  const { search, name, tag, page = 1, limit = 10, deleted, tabValue, archive,startDate,endDate, } = query || {}
  let userType = "service_user";
  if (tabValue == 2) {
    userType = "volunteer";
  } else if (tabValue == 3) {
    userType = "donor";
  }
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
    name: search,
  }

  const searchConditions = Object.entries(regexFilter(searchKeys)).map(
    ([key, value]) => ({
      [key]: value,
    })
  )

  const filter = {
    isCompletlyDelete: false,
    $or: searchConditions,
    ...(archive !== undefined && archive !== '' && { archive: archive }),
    ...(name !== undefined && name !== '' && { name: name }),
     ...(startDate && endDate && {
      createdAt: {
        $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      }
    }),
    ...(tag !== undefined && tag !== '' && { tags: tag }),
    ...(userType !== undefined && userType !== '' && { userType: userType }),
    ...(typeof deleted !== 'undefined' ? { isDelete: deleted === 'true' } : { isDelete: false }),

  }

  const allMail = await mail
    .find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })

  const total = await mail.countDocuments(filter)
  return {
    data: allMail,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  }
}
