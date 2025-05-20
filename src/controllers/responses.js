import * as responseService from '../services/responses.js'

export const saveResponse = async (req, res, next) => {
    const { formId } = req?.params
    const saveResponse = await responseService.saveResponse(formId)
    res.status(200).send(saveResponse)
}
