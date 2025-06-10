import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const SessionSchema = new mongoose.Schema(
  {
    serviceuser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    country: {
      type: String,
      required: true,
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
    benificiary: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag',
      },
    ],
    campaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag',
      },
    ],
    engagement: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag',
      },
    ],
    eventAttanded: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag',
      },
    ],
    fundingInterest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag',
      },
    ],
    fundraisingActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag',
      },
    ],
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
  },
  { timestamps: true }
)
SessionSchema.plugin(commonFieldsPlugin)
const Session = mongoose.model('session', SessionSchema)

export default Session
