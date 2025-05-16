import mongoose from 'mongoose'
const MailingListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tags: [String],
    channelSettings: [String],
    purposeSettings: [String],
    includeArchived: { type: Boolean, default: false },
    isDeleted: {
        type: Boolean,
        default: false,
      },
    filters: [
        {
            logic: {
                type: String,
                enum: ['AND', 'OR'],
                required: true
            },
            field: {
                type: String,
                required: true
            },
            comparison: {
                type: String,
                enum: ['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than'],
                required: true
            },
            value: {
                type: mongoose.Schema.Types.Mixed,
                required: true
            }
        }
    ],
},
    { timestamps: true }
);

const mail = mongoose.model("mail", MailingListSchema);
export default mail;