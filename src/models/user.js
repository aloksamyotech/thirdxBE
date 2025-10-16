import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const UserSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
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
      preferredName : String,
      otherId : String,
      nickName: String,
      gender: String,
      ethnicity: String,
      dateOfBirth: Date,
      profileImage: String,
    },

    contactInfo: {
      homePhone: String,
      phone: String,
      email: String,
      addressLine1: String,
      addressLine2: String,
      addressLine3: String,
      town: String,
      district: String,
      postcode: String,
      country: String,
      firstLanguage: String,
      otherId: String,
    },
    otherInfo: {
      file: String,
      description: String,
      tags: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tag'
        }
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
    riskAssessment: {
      riskAssessmentNotes: {
        type: String,
      },
      keyIndicators: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'configuration',
        },
      ],
    }
    ,

    contactPreferences: {
      preferredMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'configuration',
      },
      contactPurposes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'configuration',
        }
      ],
      dateOfConfirmation: Date,
      reason: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'configuration',
      },
      email: String,
      phone: String,
      contactMethods: {
        telephone: Boolean,
        email: Boolean,
        letter: Boolean,
        sms: Boolean,
        whatsapp: Boolean,
        donor: Boolean,
      },
    },
    Service: [
      {
        serviceName: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'services',
        },
        startDate: Date,
        lastDate: Date,
        referrerName: String,
        referrerJob: String,
        referrerPhone: String,
        referrerEmail: String,
        emergencyPhone: String,
        emergencyEmail: String,
        referralType: String,
        referredDate: Date,
      }
    ],

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
      enum: ['service_user', 'volunteer', 'donor', 'user'],
    },
    subRole: {
      type: String,
      enum: ['donar_individual', 'donar_company', 'donar_group'],
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isCompletlyDelete: {
      type: Boolean,
      default: false,
    },
    archive: { type: Boolean, default: false },
    archiveReason: { type: String },
  },
  { timestamps: true }
)

UserSchema.plugin(commonFieldsPlugin)

const user = mongoose.model('user', UserSchema)

export default user
