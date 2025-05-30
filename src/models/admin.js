import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  state: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  country: {
    type: String,
  },
  language: {
    type: String,
  },
  status: {
    type: String,
  },
  currency: {
    type: String,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  file: String,
  googleId: {
    type: String
  }
},
  {
    timestamps: true
  })
adminSchema.plugin(commonFieldsPlugin)
const Admin = mongoose.model('admin', adminSchema)
export default Admin
