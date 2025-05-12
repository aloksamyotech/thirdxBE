import mongoose from "mongoose";
const TagSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
    note:{type: String}
});

const tag = mongoose.model("tag", TagSchema);
export default tag;