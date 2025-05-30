import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form'
    },
    title: String,
    data: {},
    status: {
        type: String,
        default: 'PENDING'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const Response = mongoose.model('Response', ResponseSchema);
export default Response;
