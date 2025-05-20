import mongoose from 'mongoose'
const configurationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
    configurationType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const configuration = mongoose.model('configuration', configurationSchema)

export default configuration
