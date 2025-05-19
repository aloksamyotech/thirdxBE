import mongoose from 'mongoose'

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
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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
  },
  { timestamps: true }
)

const Services = mongoose.model('services', ServiceSchema)

export default Services
