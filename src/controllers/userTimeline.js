import * as userTimelineService from '../services/userTimeline.js'
import { statusCodes } from '../core/common/constant.js'

export const createRegisterAttendance = async (req, res) => {
    const data = req?.body || {};
    const { id } = req.params;
    const userTimeline = await userTimelineService.createRegisterAttendance(id, data);
    res.status(statusCodes?.ok).send(userTimeline);
}
export const createRegisterTask = async (req, res) => {
    const data = req?.body || {};
    const { id } = req.params;
    const userTimeline = await userTimelineService.createRegisterTask(id, data);
    res.status(statusCodes?.ok).send(userTimeline);
}

export const createEmailInbound = async (req, res) => {
    const data = req?.body || {};
    const { id } = req.params;
    const userTimeline = await userTimelineService.createEmailInbound(id, data);
    res.status(statusCodes?.ok).send(userTimeline);
}

export const createEmailOutbound = async (req, res) => {
    const data = req?.body || {};
    const { id } = req.params;
    const userTimeline = await userTimelineService.createEmailOutbound(id, data);
    res.status(statusCodes?.ok).send(userTimeline);
}

export const createPhoneCallInbound = async (req, res) => {
    const data = req?.body || {};
    const { id } = req.params;
    const userTimeline = await userTimelineService.createPhoneCallInbound(id, data);
    res.status(statusCodes?.ok).send(userTimeline);
}

export const createPhoneCallOutbound = async (req, res) => {
    const data = req?.body || {};
    const { id } = req.params;
    const userTimeline = await userTimelineService.createPhoneCallOutbound(id, data);
    res.status(statusCodes?.ok).send(userTimeline);
}

export const createLetterReceived = async (req, res) => {
    const data = req?.body || {};
    const { id } = req.params;
    const userTimeline = await userTimelineService.createLetterReceived(id, data);
    res.status(statusCodes?.ok).send(userTimeline);
}

export const createLetterSent = async (req, res) => {
    const data = req?.body || {};
    const { id } = req.params;
    const userTimeline = await userTimelineService.createLetterSent(id, data);
    res.status(statusCodes?.ok).send(userTimeline);
}
export const getTimeLineData = async (req, res) => {
    const { id } = req.params;
    const userTimeline = await userTimelineService.getTimeLineData(id);
    res.status(statusCodes?.ok).send(userTimeline);
}

