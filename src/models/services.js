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
    isDelete: {
      type: Boolean,
      default: false,
    },
    isCompletlyDelete: {
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
    attachment: {
      type: String,
    },
    description: {
      type: String,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag'
      }
    ],
  },
  { timestamps: true }
)
ServiceSchema.plugin(commonFieldsPlugin)
const Services = mongoose.model('services', ServiceSchema)

export default Services
