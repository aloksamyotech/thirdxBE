import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'
import list from '../models/list.js'
import user from '../models/user.js'
import  service from '../models/services.js';
import caseModel from '../models/cases.js';
import mail from '../models/mail.js'
import mongoose from 'mongoose'
import transaction from '../models/transaction.js'
import Form from '../models/form.js'
export const addList = async (data) => {
  const newList = await list.create(data)
  if (!newList) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
  return { newList }
}

export const getAllList = async () => {
  const allList = await list.find({ isCompletlyDelete: false }).sort({ createdAt: -1 })
  if (!allList) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allList }
}

export const getListWithPagination = async (query) => {
  const { search, name, tag, page, limit , deleted,archive} = query || {}  
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
    isArchive: archive == 'true',
    isCompletlyDelete: false,
    $or: searchConditions,
    ...(name !== undefined && name !== '' && { name: name }),
    ...(tag !== undefined && tag !== '' && { tags: tag }),
    ...(typeof deleted !== 'undefined' ? { isDelete: deleted === 'true' } : { isDelete: false }),

  }

  const allMail = await list
    .find(filter)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })

  const total = await list.countDocuments(filter)
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

export const getListDetailById = async (id, page = 1, limit) => {
  const listData = await list.findById(id).lean();
  if (!listData) throw new Error("List not found");

  const tagIds = listData.tags.map(tag => new mongoose.Types.ObjectId(tag));
  const purposeIds = listData.purposeSettings.map(p => new mongoose.Types.ObjectId(p));

  const channelMethodConditions = listData.channelSettings?.map(method => ({
    [`contactPreferences.contactMethods.${method}`]: true
  })) || [];

  const filterMatchConditions = [];
  for (const filter of listData.filters || []) {
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
    if (condition) filterMatchConditions.push(condition);
  }

  const skip = (page - 1) * limit;
  const listType = listData.listType?.toLowerCase();

  let Model;
  let baseMatch = {};

  if (["service_user", "donor", "volunteer"].includes(listType)) {
    Model = user;
    baseMatch = {
      role: listData.listType,
      isDelete: false,
      isCompletlyDelete: false,
      isActive: true,
      "otherInfo.tags": { $all: tagIds },
      $or: channelMethodConditions.length > 0 ? channelMethodConditions : [{}],
      "contactPreferences.contactPurposes": { $elemMatch: { $in: purposeIds } },
      $and: filterMatchConditions.length > 0 ? filterMatchConditions : [{}]
    };
  } else if (listType == "case") {
    Model = caseModel;
    baseMatch = {
      tags: { $all: tagIds },
      $and: filterMatchConditions.length > 0 ? filterMatchConditions : [{}]
    };
  } else if (listType == "services") {
    Model = service;
    baseMatch = {
      tags: { $all: tagIds },
      $and: filterMatchConditions.length > 0 ? filterMatchConditions : [{}]
    };
  } else if (listType == "donations") {
    Model = transaction;
    baseMatch = {
      $and: filterMatchConditions.length > 0 ? filterMatchConditions : [{}]
    };
  } else if (listType == "forms") {
    Model = Form;
    baseMatch = {
      $and: filterMatchConditions.length > 0 ? filterMatchConditions : [{}]
    };
  } else if (listType == "Mailing List") {
    Model = mail;
    baseMatch = {
      tags: { $all: tagIds },
      $and: filterMatchConditions.length > 0 ? filterMatchConditions : [{}]
    };
  } else {
    throw new Error(`Unsupported list type: ${listType}`);
  }

  const result = await Model.aggregate([
    { $match: baseMatch },
    { $skip: skip },
    { $limit: limit }
  ]);

  const totalCountAgg = await Model.aggregate([
    { $match: baseMatch },
    { $count: "total" }
  ]);

  const total = totalCountAgg[0]?.total || 0;

  return {
    data: result,
    listData,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};


export const assignTagToEntities = async ({ entityIds = [], tagId }) => {
  if (!mongoose.Types.ObjectId.isValid(tagId)) {
    return new CustomError(
      statusCodes.badRequest,
      'Invalid tagId provided',
      errorCodes.bad_request
    )
  }

  let updatedCount = 0

  for (const id of entityIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) continue
    const userResult = await user.updateOne(
      { _id: id },
      { $addToSet: { 'otherInfo.tags': tagId } }
    )
    if (userResult.modifiedCount > 0) {
      updatedCount++
      continue
    }
    const serviceResult = await service.updateOne(
      { _id: id },
      { $addToSet: { tags: tagId } }
    )
    if (serviceResult.modifiedCount > 0) {
      updatedCount++
      continue
    }

    // Try updating Case
    const caseResult = await caseModel.updateOne(
      { _id: id },
      { $addToSet: { tags: tagId } }
    )
    if (caseResult.modifiedCount > 0) {
      updatedCount++
      continue
    }

    // Try updating Mailing List
    const mailResult = await mail.updateOne(
      { _id: id },
      { $addToSet: { tags: tagId } }
    )
    if (mailResult.modifiedCount > 0) {
      updatedCount++
      continue
    }
  }

  if (updatedCount === 0) {
    return new CustomError(
      statusCodes.notFound,
      'No matching entities were found or updated.',
      errorCodes.not_found
    )
  }

  return {
    message: `Tag assigned to ${updatedCount} entities.`,
    updatedCount
  }
}
