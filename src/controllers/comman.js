import { statusCodes } from '../core/common/constant.js'
import * as commanFuntions from '../services/comman.js'

export const findTagWithCategory = async (req, res) => {
    const { appliedTo } = req?.query
    const allCategory = await commanFuntions.findTagWithCategory(appliedTo)
    res.status(statusCodes?.ok).send(allCategory)

}
