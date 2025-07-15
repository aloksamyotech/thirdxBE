import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
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
    },
    password: {
      type: String,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    file: String,
    googleId: {
      type: String,
    },
    accountType: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin'
    },
    permissions: {
      cases: { type: Boolean, default: false },
      donorManagement: { type: Boolean, default: false },
      forms: { type: Boolean, default: false },
      mailingList: { type: Boolean, default: false },
      people: { type: Boolean, default: false },
      services: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true,
  }
)
adminSchema.plugin(commonFieldsPlugin)
const Admin = mongoose.model('admin', adminSchema)
export default Admin
