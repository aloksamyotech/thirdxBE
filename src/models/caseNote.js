import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'

const caseNoteSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
  },
  date: {
    type: Date,
    required: true,
  },
  configurationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'configuration',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  access: {
    type: Boolean,
    default: true,
  },
  file: {
    type: String,
  },
 
  isArchive: {
    type: Boolean,
    default: false,
  },
})
caseNoteSchema.plugin(commonFieldsPlugin)
const CaseNote = mongoose.model('CaseNote', caseNoteSchema)

export default CaseNote
