import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema(
  {
    personalInfo: {
      title: String,
      firstName: {
        type: String,
        // required: true,
      },
      middleName: String,
      lastName: {
        type: String,
        // required: true
      },
      nickName: String,
      gender: String,
      ethnicity: String,
      dateOfBirth: Date,
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

    otherInfo: {
      file: String,
      description: String,
      benificiary: String,
      campaigns: String,
      engagement: String,
      eventAttanded: String,
      fundingInterest: String,
      fundraisingActivities: String,
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
      preferredMethod: String,
      contactPurposes: String,
      dateOfConfirmation: Date,
      reason: String,
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
      recruitmentCampaign: { type: String },
    },
    role: {
      type: String,
      required: true,
      enum: ['service_user', 'volunteer', 'donor','user'],
    },
    subRole: {
      type: String,
      enum: ['donar_individual', 'donar_company', 'donar_group'],
    },
    isActive: { type: Boolean, required: true, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)
const user = mongoose.model('user', UserSchema)

export default user
