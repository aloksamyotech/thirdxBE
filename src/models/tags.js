import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const TagSchema = new mongoose.Schema({
  tagDescription: { type: String, required: true },
  tagCategoryName: { type: String, required: true },
  name: { type: String, required: true },
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
