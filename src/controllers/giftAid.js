import * as giftAidService from '../services/giftAid.js'
import { statusCodes } from '../core/common/constant.js'

export const createGiftAid = async (req, res) => {
    const data = req?.body || {};
    const { id } = req.params;
    const giftAid = await giftAidService.createGiftAid(id, data);
    res.status(statusCodes?.ok).send(giftAid);
}