import { regexFilter } from "../core/common/common.js"
import { errorCodes, Message, statusCodes } from "../core/common/constant.js"
import Attendees from "../models/attendees.js"
import CustomError from "../utils/exception.js"
import { isExistSession } from "./session.js"
import { isExistUser } from "./user.js"

export const addAttendee = async (attendeesData) => {
    const checkUserExistance = await isExistUser(attendeesData?.userId);
    if (!checkUserExistance) {
        throw new CustomError(
            statusCodes?.badRequest,
            Message?.userNotFound,
            errorCodes?.bad_request
        );
    }

    const checkSessionExistance = await isExistSession(attendeesData?.sessionId);
    if (!checkSessionExistance) {
        throw new CustomError(
            statusCodes?.badRequest,
            Message?.sessionNotFound,
            errorCodes?.bad_request
        );
    }

    const existingAttendance = await Attendees.findOne({
        attendee: attendeesData?.userId,
        session: attendeesData?.sessionId,
    });

    if (existingAttendance) {
        throw new CustomError(
            statusCodes?.conflict,
            Message?.userAlreadyInSession,
            errorCodes?.conflict
        );
    }

    const attendeesPayload = {
        attendee: attendeesData?.userId,
        session: attendeesData?.sessionId,
    };

    const attendeesSchema = new Attendees(attendeesPayload);
    return await attendeesSchema.save();
};

export const getAllAttendees = async () => {
    return await Attendees.find()
        .populate("attendee")
        .populate("session")
        .sort({ createdAt: -1 })
}


export const getAttendees = async (query) => {
    const { search, status, page = 1, limit = 10 } = query || {}
    let pageNumber = Number(page)
    let limitNumber = Number(limit)
    if (pageNumber < 1) {
        pageNumber = 1
    }

    if (limitNumber < 1) {
        limitNumber = 10
    }
    const skip = (pageNumber - 1) * limitNumber
    const searchKeys = {}
    const searchConditions = Object.entries(regexFilter(searchKeys)).map(
        ([key, value]) => ({
            [key]: value,
        })
    )
    const filter = {
        $or: searchConditions,
    }

    const attendeesData = await Attendees.find(filter)
        .populate("attendee")
        .populate("session")
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 })
        .notDeleted()

    const total = await Attendees.countDocuments(filter)

    return {
        data: attendeesData,
        meta: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        },
    }

}


export const getAttendeeBySession = async ({ params, query }) => {
    const { sessionId } = params;
    const { search, status, page = 1, limit = 5 } = query || {};
    
    // Rest of your implementation remains the same
    let pageNumber = Number(page);
    let limitNumber = Number(limit);
    
    if (pageNumber < 1) pageNumber = 1;
    if (limitNumber < 1) limitNumber = 5;
    
    const skip = (pageNumber - 1) * limitNumber;
    
    const filter = {
        session: sessionId
    };
    
    if (search) {
        const searchKeys = {}; 
        const searchConditions = Object.entries(regexFilter(searchKeys)).map(
            ([key, value]) => ({ [key]: value })
        );
        
        filter.$and = [
            ...searchConditions,
            { session: sessionId }
        ];
    }

    const attendeesData = await Attendees.find(filter)
        .populate("attendee")
        .populate("session")
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 })
        .notDeleted();

    const total = await Attendees.countDocuments(filter);

    return {
        data: attendeesData,
        meta: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        },
    };
};
