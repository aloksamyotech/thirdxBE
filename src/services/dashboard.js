import Transaction from '../models/transaction.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'
import Session from '../models/session.js';
import user from '../models/user.js';
import Case from '../models/cases.js';
import task from '../models/task.js';
import path from 'path';

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
    const total = result[0]?.totalAmountPaid || 0;
    return { totalDonation: total }

};

export const getAllSessionDelivered = async () => {

    const result = await Session.find({isDeleted:false})
    const totalSession =  result.length;
    return {totalSession}
    
};


export const getAllActiveServiceUser = async () => {
    const result = await user.find({role:"service_user", isDeleted: false})
    const totalUser=  result.length;
    return {totalUser}
};


export const getAllOpenCased = async () => {
     const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const cases = await Case.find({
      isArchive: false,
      caseOpened: { $lte: today },
      $or: [
        { caseClosed: null },
        { caseClosed: { $gte: today } }
      ]
    });

    const totalcase = cases.length;
    return {totalcase};
};




export const createTask = async (data) => {
       const  { details,assignedTo, dueDate, isCompleted, notification } = data;

 if(!assignedTo){
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

  const Task =  await newTask.save();
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