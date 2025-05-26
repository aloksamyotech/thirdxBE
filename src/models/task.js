import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const TaskSchema = new mongoose.Schema({
  details: { type: String, required: true },
  assignedTo : {  
     type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  dueDate: { type: Date },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  notification: {
    type: Boolean,
    default: false,
  }},
  { timestamps: true }
)
TaskSchema.plugin(commonFieldsPlugin)
const task = mongoose.model('task', TaskSchema)
export default task;
