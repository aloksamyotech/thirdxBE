import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const UserSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      unique: true,
      default: uuidv4,
    },
    personalInfo: {
      title: String,
      firstName: {
        type: String,
      },
      middleName: String,
      lastName: {
        type: String,
      },
      nickName: String,
      gender: String,
      ethnicity: String,
      dateOfBirth: Date,
      profileImage:String
    },

    contactInfo: {
      homePhone: String,
      phone: String,
      email: String,
      addressLine1: String,
      addressLine2: String,
      town: String,
      district: String,
      postcode: String,
      country: String,
      firstLanguage: String,
      otherId: String,
    },

    // otherInfo: {
    //   file: String,
    //   description: String,
    //   benificiary: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'tag',
    //   },
    //   campaigns:  {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'tag',
    //   },
    //   engagement:  {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'tag',
    //   },
    //   eventAttanded:  {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'tag',
    //   },
    //   fundingInterest:  {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'tag',
    //   },
    //   fundraisingActivities:  {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'tag',
    //   },
    //   restrictAccess: Boolean,
    // },
    otherInfo: {
      file: String,
      description: String,
      benificiary: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tag',
        },
      ],
      campaigns: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tag',
        },
      ],
      engagement: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tag',
        },
      ],
      eventAttanded: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tag',
        },
      ],
      fundingInterest: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tag',
        },
      ],
      fundraisingActivities: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'tag',
        },
      ],
      restrictAccess: Boolean,
    },

    emergencyContact: {
      title: String,
      gender: String,
      firstName: String,
      lastName: String,
      relationshipToUser: String,
      homePhone: String,
      phone: String,
      email: String,
      addressLine1: String,
      addressLine2: String,
      country: String,
      town: String,
      postcode: String,
    },

    contactPreferences: {
      preferredMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'configuration',
        required: true,
      },
      contactPurposes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'configuration',
        required: true,
      },
      dateOfConfirmation: Date,
      reason: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'configuration',
        required: true,
      },
      email: String,
      phone: String,
      contactMethods: {
        telephone: Boolean,
        email: Boolean,
        sms: Boolean,
        whatsapp: Boolean,
        donor: Boolean,
      },
    },
    companyInformation: {
      companyName: { type: String },
      mainContactName: { type: String },
      socialMediaLinks: { type: String },
      otherId: { type: String },
      recruitmentCampaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'configuration',
      },
    },
    role: {
      type: String,
      required: true,
      enum: ['service_user', 'volunteer', 'donor', 'user'],
    },
    subRole: {
      type: String,
      enum: ['donar_individual', 'donar_company', 'donar_group'],
    },
    archive: { type: Boolean, default: false },
  },
  { timestamps: true }
)

UserSchema.plugin(commonFieldsPlugin)

const user = mongoose.model('user', UserSchema)

export default user
