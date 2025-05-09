import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  serviceCode: { type: String, required: true, unique: true },
  serviceType: { type: String, required: true },
  serviceStatus: { type: String, required: true },
  caseOpened: { type: Date },
  caseClosed: { type: Date },
  benificiary:
  {
    type: String
  },
  campaigns:
  {
    type: String
  },
  engagement:
  {
    type: String
  },
  eventAttanded:
  {
    type: String
  },
  fundingInterest:
  {
    type: String
  },
  fundraisingActivities:
  {
    type: String
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  file: {
    type: String,
  },
  description: { type: String },
},
  { timestamps: true }
);

const Case = mongoose.model("Case", caseSchema);
export default Case;
