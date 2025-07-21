import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const SessionSchema = new mongoose.Schema(
  {
    serviceuser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'configuration',
    },

    isArchive: {
      type: Boolean,
      default: false,
    },
    archiveReason: {
      type: String
    },
    file: {
      type: String,
    },
    description: {
      type: String,
    },

    time: {
      type: String,
    },
    date: {
      type: Date,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'services',
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
  },
  { timestamps: true }
)
SessionSchema.plugin(commonFieldsPlugin)
const Session = mongoose.model('session', SessionSchema)

export default Session
