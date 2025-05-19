import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

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
    serviceStatus: { type: String, required: true },
    caseOpened: { type: Date },
    caseClosed: { type: Date },
    benificiary: {
      type: String,
    },
    campaigns: {
      type: String,
    },
    engagement: {
      type: String,
    },
    eventAttanded: {
      type: String,
    },
    fundingInterest: {
      type: String,
    },
    fundraisingActivities: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    file: {
      type: String,
    },
    description: { type: String },
  },
  { timestamps: true }
)

const Case = mongoose.model('Case', caseSchema)
export default Case
