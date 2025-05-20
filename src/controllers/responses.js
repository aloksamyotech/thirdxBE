import * as responseService from '../services/responses.js'

export const saveResponse = async (req, res, next) => {
    const saveResponse = await responseService.saveResponse(req, res, next)
    res.status(200).send(saveResponse)
}
