import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import UserTimeline from '../models/userTimeline.js'
import CaseNote from "../models/caseNote.js"

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


// export const getTimeLineData = async (userId) => {
//     const newTimeline = await UserTimeline.findOne({ userId })
//         .populate('userId')
//         .populate('giftAidId')
//         .populate('registerAttendance.serviceId')
//         .populate('registerAttendance.sessionId')
//         .populate('taskId')
//         .populate('emailInbound._id')
//         .populate('emailOutbound._id')
//         .populate('caseNoteId')
//         .populate('donationId')
//         .populate('letterReceived._id')
//         .populate('letterSent._id');

//     if (!newTimeline) return { newTimeline: null, timeline: [] };

//     const timelineItems = [];

//     const pushItems = (items, type) => {
//         if (!Array.isArray(items)) return;

//         items.forEach(item => {
//             const date = item?.createdAt || item?.createdDate;
//             if (date) {
//                 timelineItems.push({
//                     type,
//                     _id: item._id,
//                     date: date
//                 });
//             }
//         });
//     };


//     pushItems(newTimeline.donationId, 'donation');
//     pushItems(newTimeline.caseNoteId, 'caseNote');
//     pushItems(newTimeline.emailInbound, 'emailInbound');
//     pushItems(newTimeline.emailOutbound, 'emailOutbound');
//     pushItems(newTimeline.letterReceived, 'letterReceived');
//     pushItems(newTimeline.letterSent, 'letterSent');
//     pushItems(newTimeline.phoneCallInbound, 'phoneCallInbound');
//     pushItems(newTimeline.phoneCallOutbound, 'phoneCallOutbound');
//     pushItems(newTimeline.taskId, 'task');
//     pushItems(newTimeline.registerAttendance, 'attendance');


//     timelineItems.sort((a, b) => new Date(a.date) - new Date(b.date));

//     return {
//         newTimeline,
//         timeline: timelineItems
//     };
// };




export const getTimeLineData = async (userId) => {
    try {
        let newTimeline = await UserTimeline.findOne({ userId }).populate([
            { path: 'userId' },
            { path: 'giftAidId' },
            { path: 'registerAttendance.serviceId' },
            { path: 'registerAttendance.sessionId' },
            { path: 'taskId' },
            { path: 'emailInbound._id' },
            { path: 'emailOutbound._id' },
            { path: 'donationId' },
            { path: 'letterReceived._id' },
            { path: 'letterSent._id' },
            { path: 'phoneCallInbound' },
            { path: 'phoneCallOutbound' },
            { path: 'caseNoteId', model: 'CaseNote' }
        ]);

        if (!newTimeline) {
            return { newTimeline: null, timeline: [] };
        }

        const timelineItems = [];

        const pushItems = (items = [], type) => {
            if (!Array.isArray(items)) {
                return;
            }
            items.forEach(({ _id, createdAt, createdDate }) => {
                const date = createdAt || createdDate;
                if (!date) {
                    return;
                }
                timelineItems.push({ type, _id, date });
            });
        };

        const timelineFields = [
            ['donationId', 'donation'],
            ['emailInbound', 'emailInbound'],
            ['emailOutbound', 'emailOutbound'],
            ['letterReceived', 'letterReceived'],
            ['letterSent', 'letterSent'],
            ['phoneCallInbound', 'phoneCallInbound'],
            ['phoneCallOutbound', 'phoneCallOutbound'],
            ['taskId', 'task'],
            ['registerAttendance', 'attendance'],
        ];

        timelineFields.forEach(([field, type]) => pushItems(newTimeline[field], type));

        if (Array.isArray(newTimeline.caseNoteId)) {
            newTimeline.caseNoteId.forEach(({ _id, createdAt }) => {
                if (createdAt) {
                    timelineItems.push({ type: 'caseNote', _id, date: createdAt });
                } else {
                    console.log(`Skipping caseNote with _id ${_id} due to missing createdAt`);
                }
            });
        }

        timelineItems.sort((a, b) => new Date(a.date) - new Date(b.date));

        return { newTimeline, timeline: timelineItems };

    } catch (error) {
        console.error('Error fetching timeline data:', error);
        return { newTimeline: null, timeline: [] };
    }
};


