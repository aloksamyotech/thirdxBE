import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema({
  id: String,
  name: String,
  label: String,
  type: String,
  values: [{
    label: String,
    value: String
  }],
  validation: String,
  required: Boolean
});

const FormSchema = new mongoose.Schema({
  title: String,
  template: String,
  fields: [FieldSchema],
  publicId: { type: String, unique: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Form = mongoose.model('Form', FormSchema);
export default Form;
