import * as responseService from '../services/responses.js'

export const saveResponse = async (req, res, next) => {
    const { formId } = req?.params
    const body = req?.body
    const saveResponse = await responseService.saveResponse(formId, body)
    res.status(200).send(saveResponse)
}

export const getAllResponse = async (req, res) => {
    const getAllResponse = await responseService.getAllResponse()
    res.status(200).send(getAllResponse)
}

export const getResponseById = async (req, res) => {
    const { id } = req?.params
    const getResponseById = await responseService.getResponseById(id)
    res.status(200).send(getResponseById)
}

export const updateResponseStatus = async (req, res) => {
    const { id } = req?.params
    const { status } = req?.body
    const updateResponseStatus = await responseService.updateResponseStatus(id, status)
    res.status(200).send(updateResponseStatus)
}