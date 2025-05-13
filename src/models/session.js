import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema(
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
    type: {
      type: String,
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
     time: {
      type: String,
    },
    date:{
      type: Date
    }
  },
  { timestamps: true }
)

const Session = mongoose.model('services', SessionSchema)

export default Session;
