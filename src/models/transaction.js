import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    assignedTo: { type: String },
    campaign: { type: String },
    amountPaid: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card', 'bank_transfer', 'cheque', 'online'],
        required: true
    },
    processingCost: { type: Number, default: 0 },
    currency: {
        type: String,
        required: true
    },
    receiptNumber: { type: String },
    transactionId: { type: String, unique: true },
    isDeleted: { type: Boolean, default: false }
},

    { timestamps: true }
);

const transaction = mongoose.model('transaction', TransactionSchema)
export default transaction