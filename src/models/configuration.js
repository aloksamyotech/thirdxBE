import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'

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
configurationSchema.plugin(commonFieldsPlugin)
const configuration = mongoose.model('configuration', configurationSchema)

export default configuration
