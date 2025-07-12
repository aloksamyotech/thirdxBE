/* eslint-disable no-undef */
import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'

const TagCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    appliedTo: [String],
    isArchive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)
TagCategorySchema.plugin(commonFieldsPlugin)
const tagCategory = mongoose.model('tagCategory', TagCategorySchema)
export default tagCategory
