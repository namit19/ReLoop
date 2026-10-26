import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a product title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
      trim: true,
      maxlength: [4000, 'Description cannot exceed 4000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price must be greater than or equal to 0'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    condition: {
      type: String,
      required: [true, 'Please select item condition'],
      enum: {
        values: ['Like New', 'Good', 'Fair'],
        message: '{VALUE} is not a valid condition',
      },
    },
    location: {
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      locality: {
        type: String,
        trim: true,
        default: '',
      },
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [imageSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one image is required for a listing',
      },
    },
    thumbnail: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'reserved', 'sold'],
      default: 'active',
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save to ensure thumbnail is set from first image if not specified
productSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0 && !this.thumbnail) {
    this.thumbnail = this.images[0].url;
  }
  next();
});

// Text index for search
productSchema.index({ title: 'text', description: 'text', brand: 'text' });
// Compound indexes for sorting and filtering
productSchema.index({ category: 1, status: 1, createdAt: -1 });
productSchema.index({ price: 1, status: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
