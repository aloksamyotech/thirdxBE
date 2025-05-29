import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
   
    isArchive: {
      type: Boolean,
      default: false,
    },
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'configuration',
      required: true,
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
  },
  { timestamps: true }
)
ServiceSchema.plugin(commonFieldsPlugin)
const Services = mongoose.model('services', ServiceSchema)

export default Services
