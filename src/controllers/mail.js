import * as mailService from '../services/mail.js'
import { statusCodes } from '../core/common/constant.js'

export const addMail = async (req, res) => {
    const data = req?.body || {}
    const addMail = await mailService.addMail(data)
    res.status(statusCodes?.ok).send(addMail)
}

export const getAllMail = async (req, res) => {
    const allMail = await mailService.getAllMail()
    res.status(statusCodes?.ok).send(allMail)
}

export const filter = async (req, res) => {
    const { tag, name } = req?.query || {}
    const filter = await mailService.filter(tag, name)
    res.status(statusCodes?.ok).send(filter)
}

export const editMail = async (req, res) => {
    const { mailId } = req.params.mailId;
    const {name, tags, channelSettings, purposeSettings, includeArchived} = req.body;
    const mailData = {
        name, 
        tags, 
        channelSettings, 
        purposeSettings, 
        includeArchived
      };
    const editMail = await mailService.editMail(
        mailId,
        mailData
    )
    res.status(statusCodes?.ok).send(editMail)
}

export const deleteMail = async (req, res) => {
    const mailId = req.params.mailId;
    const deleteMail = await mailService.deleteMail(mailId)
    res.status(statusCodes?.ok).send(deleteMail)
}


