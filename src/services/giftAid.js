import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import GiftAid from '../models/giftAid.js'
import UserTimeline from '../models/userTimeline.js'

export const createGiftAid = async (userId, data) => {
    const newGiftAid = await GiftAid.create(data)
    if (!newGiftAid) {
        return new CustomError(
            statusCodes?.badRequest,
            Message?.notCreated,
            errorCodes?.bad_request
        )
    }

    await UserTimeline.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { giftAidId: newGiftAid._id } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return { newGiftAid }
}