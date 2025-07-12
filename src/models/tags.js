import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'

const TagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tagCategory',
    required: true
  },
  startDate: { type: Date },
  endDate: { type: Date },

  isArchive: {
    type: Boolean,
    default: false,
  },
  note: { type: String },
})
TagSchema.plugin(commonFieldsPlugin)
const tag = mongoose.model('tag', TagSchema)
export default tag
