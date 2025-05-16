import * as transactionService from '../services/transaction.js'
import { statusCodes } from '../core/common/constant.js'

export const addTransaction = async (req, res, next) => {
    const addTransaction = await transactionService.addTransaction(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(addTransaction)
}

export const getAllTransaction = async (req, res, next) => {
    const getAllTransaction = await transactionService.getAllTransaction(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(getAllTransaction)
}

export const filter = async (req, res, next) => {
    const filter = await transactionService.filter(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(filter)
}

export const editTransaction = async (req, res, next) => {
    const editTransaction = await transactionService.editTransaction(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(editTransaction)
}

export const deleteTransaction = async (req, res, next) => {
    const deleteTransaction = await transactionService.deleteTransaction(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(deleteTransaction)
}
