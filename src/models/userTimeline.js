import mongoose from 'mongoose';
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js';

const UserTimelineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    giftAidId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'giftAid',
    }],
    caseNoteId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CaseNote',
    }],
    registerAttendance: [{
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'services',
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'session',
        },
        createdDate: { type: Date, default: () => new Date() }
    }],
    taskId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task',
    }],
    donationId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transaction',
    }],
    emailInbound: [{
        dateReceived: { type: Date },
        createdDate: { type: Date, default: () => new Date() },
    }],
    emailOutbound: [{
        dateSent: { type: Date },
        createdDate: { type: Date, default: () => new Date() },
    }],
    phoneCallInbound: [{
        dateReceived: { type: Date },
        createdDate: { type: Date, default: () => new Date() },
    }],
    phoneCallOutbound: [{
        dateSent: { type: Date },
        createdDate: { type: Date, default: () => new Date() },
    }],
    letterReceived: [{
        dateReceived: { type: Date },
        createdDate: { type: Date, default: () => new Date() },
    }],
    letterSent: [{
        dateSent: { type: Date },
        createdDate: { type: Date, default: () => new Date() },
    }]
},
    { timestamps: true }
)

UserTimelineSchema.plugin(commonFieldsPlugin)
const UserTimeline = mongoose.model('userTimeline', UserTimelineSchema)
export default UserTimeline;
