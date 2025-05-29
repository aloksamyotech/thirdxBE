import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'


const caseSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      unique: true,
      default: uuidv4,
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
    serviceType: { type: String, required: true },
    caseOpened: { type: Date },
    caseClosed: { type: Date },
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

    isArchive: {
      type: Boolean,
      default: false,
    },
   
    file: {
      type: String,
    },
    description: { type: String },
  },
  { timestamps: true }
)
caseSchema.plugin(commonFieldsPlugin)
const Case = mongoose.model('Case', caseSchema)
export default Case
