/* eslint-disable no-undef */
import mongoose from 'mongoose'

const TagCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagsCanBeAppliedTo: [String],
    isActive: { type: Boolean, default: true },
    tags: [TagSchema],
    isDeleted: { type: Boolean, default: false },
    isArchive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const tagCategory = mongoose.model('tagCategory', TagCategorySchema)
export default tagCategory
