import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import UserTimeline from '../models/userTimeline.js'

export const createRegisterAttendance = async (userId, data) => {
    const newTimeline = await UserTimeline.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { registerAttendance: data } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return { newTimeline }
}

export const createEmailInbound = async (userId, data) => {
    const newTimeline = await UserTimeline.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { emailInbound: data } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return { newTimeline }
}

export const createEmailOutbound = async (userId, data) => {
    const newTimeline = await UserTimeline.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { emailOutbound: data } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return { newTimeline }
}

export const createPhoneCallInbound = async (userId, data) => {
    const newTimeline = await UserTimeline.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { phoneCallInbound: data } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return { newTimeline }
}

export const createPhoneCallOutbound = async (userId, data) => {
    const newTimeline = await UserTimeline.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { phoneCallOutbound: data } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return { newTimeline }
}

export const createLetterReceived = async (userId, data) => {
    const newTimeline = await UserTimeline.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { letterReceived: data } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return { newTimeline }
}

export const createLetterSent = async (userId, data) => {
    const newTimeline = await UserTimeline.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { letterSent: data } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return { newTimeline }
}