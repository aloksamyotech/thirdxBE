import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js';
const ObjectId = mongoose.Schema.Types.ObjectId

const attendeesSchema = new mongoose.Schema({
    attendee: {
        type: ObjectId,
        required: true,
        ref: "user"
    },
    session: {
        type: ObjectId,
        required: true,
        ref: "session"
    }
})

attendeesSchema.plugin(commonFieldsPlugin);
const Attendees = mongoose.model('attendee', attendeesSchema)
export default Attendees;