import mongoose from 'mongoose'
import { commonFieldsPlugin } from './plugin/commonFields.plugin.js'
const GiftAidSchema = new mongoose.Schema({
    title: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    campaign: { type: String },
    declarationDate: { type: Date },
    declarationMethod: { type: String },
    declarationStartDate: { type: Date },
    declarationEndDate: { type: Date },
    confirmDate: { type: Date },
    cancelDate: { type: Date },
},
    { timestamps: true }
)
GiftAidSchema.plugin(commonFieldsPlugin)
const GiftAid = mongoose.model('giftAid', GiftAidSchema);
export default GiftAid;
