import mongoose from 'mongoose'
 
const SessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },isArchive: {
        type: Boolean,
        default: false,
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
    },
     serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'services',
    },
  },
  { timestamps: true }
)
 
const Session = mongoose.model('session', SessionSchema)
 
export default Session;
 