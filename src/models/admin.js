import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})
adminSchema.plugin(commonFieldsPlugin)
const Admin = mongoose.model('admin', adminSchema)
export default Admin
