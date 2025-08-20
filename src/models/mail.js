import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const MailingListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userType:{ type: String, enum:['service_user', 'volunteer', 'donor']},
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tag',
    }],
    channelSettings: [{
      type: String,
      enum: ['telephone', 'email', 'letter', 'sms', 'whatsapp', 'donor_tag'],
      required: true,
    }],
    purposeSettings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'configuration',
    }],
    includeArchived: { type: Boolean, default: false },
    archive: { type: Boolean, default: false },
    filters: [
      {
        id: {
          type: Number,
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
        operator_to_next: {
          type: String,
          enum: ['AND', 'OR'],
        },
      },
    ],
  },
  { timestamps: true }
)
MailingListSchema.plugin(commonFieldsPlugin)
const mail = mongoose.model('mail', MailingListSchema)
export default mail
