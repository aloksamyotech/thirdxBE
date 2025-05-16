import * as mailService from '../services/mail.js'
import { statusCodes } from '../core/common/constant.js'

export const addMail = async (req, res, next) => {
    const addMail = await mailService.addMail(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(addMail)
}

export const getAllMail = async (req, res, next) => {
    const allMail = await mailService.getAllMail(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(allMail)
}

export const filter = async (req, res, next) => {
    const filter = await mailService.filter(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(filter)
}

export const editMail = async (req, res, next) => {
    const editMail = await mailService.editMail(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(editMail)
}

export const deleteMail = async (req, res, next) => {
    const deleteMail = await mailService.deleteMail(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(deleteMail)
}


