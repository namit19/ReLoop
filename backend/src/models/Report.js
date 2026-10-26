import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for reporting'],
      enum: [
        'Prohibited or Illegal Item',
        'Fraud, Scam or Fake Listing',
        'Incorrect Category or Information',
        'Offensive Content or Harassment',
        'Duplicate Listing',
        'Other',
      ],
    },
    details: {
      type: String,
      maxlength: [1000, 'Details cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ product: 1, reporter: 1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
