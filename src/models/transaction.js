import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const TransactionSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'configuration',
      required: true,
    },
    amountPaid: { type: Number, required: true },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'configuration',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'configuration',
    },
    processingCost: { type: Number, default: 0 },
    currency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'configuration',
    },
    receiptNumber: { type: String },
    transactionId: { type: String, unique: true },

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
    amountDue: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
  },
  

  { timestamps: true }
)
TransactionSchema.plugin(commonFieldsPlugin)
const transaction = mongoose.model('transaction', TransactionSchema)
export default transaction
