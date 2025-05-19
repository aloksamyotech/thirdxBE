import * as transactionService from '../services/transaction.js'
import { statusCodes } from '../core/common/constant.js'

export const addTransaction = async (req, res) => {
    const data = req?.body || {}
    const addTransaction = await transactionService.addTransaction(data)
    res.status(statusCodes?.ok).send(addTransaction)
}

export const getAllTransaction = async (req, res) => {
    const getAllTransaction = await transactionService.getAllTransaction()
    res.status(statusCodes?.ok).send(getAllTransaction)
}

export const filter = async (req, res) => {
    const { name, date, campaign } = req?.query || {}
    const filter = await transactionService.filter(name, date, campaign)
    res.status(statusCodes?.ok).send(filter)
}

export const editTransaction = async (req, res) => {
    const { id } = req.params.id;

  const {
    assignedTo,
    campaign,
    amountPaid,
    paymentMethod,
    processingCost,
    currency,
    receiptNumber,
    transactionId,
  } = req.body;

  const transactionData = {
    assignedTo,
    campaign,
    amountPaid,
    paymentMethod,
    processingCost,
    currency,
    receiptNumber,
    transactionId,
  };

    const editTransaction = await transactionService.editTransaction(id, transactionData)
    res.status(statusCodes?.ok).send(editTransaction)
}

export const deleteTransaction = async (req, res) => {
    const id = req.params.id
    const deleteTransaction = await transactionService.deleteTransaction(id)
    res.status(statusCodes?.ok).send(deleteTransaction)
}

export const getTransactionwithPagination = async (req, res) => {
  const searchData = await transactionService.getTransactionwithPagination(req?.query)
  res.status(statusCodes?.ok).send(searchData)
}
