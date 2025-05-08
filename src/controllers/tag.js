import * as tagService from '../services/tag.js'
import { statusCodes } from '../core/common/constant.js'

export const addTags = async (req, res, next) => {
    const addTags = await tagService.addTags(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(addTags)
}

export const getAllTags = async (req, res, next) => {
    const alltags = await tagService.getAllTags(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(alltags)
}

export const updateTagStatus = async (req, res, next) => {
    const updateTagStatus = await tagService.updateTagStatus(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(updateTagStatus)
}

export const filter = async (req, res, next) => {
    const filter = await tagService.filter(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(filter)
}
