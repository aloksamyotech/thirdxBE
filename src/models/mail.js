import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const MailingListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // tags: [String],
    tags: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tag',
    },
    channelSettings: [String],
    purposeSettings: [String],
    includeArchived: { type: Boolean, default: false },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
    filters: [
      {
        logic: {
          type: String,
          enum: ['AND', 'OR'],
          required: true,
        },
        field: {
          type: String,
          required: true,
        },
        comparison: {
          type: String,
          enum: [
            'equals',
            'not_equals',
            'contains',
            'not_contains',
            'greater_than',
            'less_than',
          ],
          required: true,
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)
MailingListSchema.plugin(commonFieldsPlugin)
const mail = mongoose.model('mail', MailingListSchema)
export default mail
