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

export const addTask = async (req, res) => {
     const  { details,assignedTo, dueDate, isCompleted, notification } = req.body;
       const taskData = {
      details,
      assignedTo,
      dueDate,
      isCompleted,
      notification,
    };

  const addTask = await dashboardService.createTask(taskData);
  res.status(statusCodes?.ok).send(addTask)
}

export const editTask = async (req, res) => {
    const taskId =   req.params.id 
     const  { details,assignedTo, dueDate, isCompleted, notification } = req.body;
       const taskData = {
      details,
      assignedTo,
      dueDate,
      isCompleted,
      notification,
    };

  const addTask = await dashboardService.editTask(taskId,taskData);
  res.status(statusCodes?.ok).send(addTask)
}

export const getTaskById = async (req, res) => {
  const taskId = req?.params?.id
  const searchData = await dashboardService.getTaskById(taskId)
  res.status(statusCodes?.ok).send(searchData)
}


export const deleteTask = async (req, res) => {
  const taskId = req.params.id
  const deletedServices = await dashboardService.deleteTask(taskId)
  res.status(statusCodes?.ok).send(deletedServices);
}


export const getAllTask = async (req, res) => {
  const getAllTasks = await dashboardService.getAllTask()
  res.status(statusCodes?.ok).send(getAllTasks);
}
