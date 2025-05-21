import mongoose from 'mongoose'
const TagSchema = new mongoose.Schema({
  tagDescription: { type: String, required: true },
  tagCategoryName: { type: String, required: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  isDeleted: { type: Boolean, default: false },
  isArchive: {
    type: Boolean,
    default: false,
  },
  note: { type: String },
})

const tag = mongoose.model('tag', TagSchema)
export default tag
