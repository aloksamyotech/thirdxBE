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
