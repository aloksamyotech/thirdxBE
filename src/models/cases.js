import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const caseSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
    },
    serviceUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'services',
      required: true,
    },
    caseOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true,
    },
    caseOpened: { type: Date },
    caseClosed: { type: Date },

    isArchive: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isCompletlyDelete: {
      type: Boolean,
      default: false,
    },

    file: {
      type: String,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
    description: { type: String },
    status: {
      type: String,
      enum: ['pending', 'close', 'open'],
      required: true
    }
  },
  { timestamps: true }
)
caseSchema.plugin(commonFieldsPlugin)
const Case = mongoose.model('Case', caseSchema)
export default Case
