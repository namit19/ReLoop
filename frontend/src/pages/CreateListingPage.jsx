import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  DollarSign,
  MapPin,
  Tag,
  FileText,
  Layers,
} from 'lucide-react';
import { CATEGORIES, CITIES, CONDITIONS } from '../utils/categories';
import ImageUploader from '../components/products/ImageUploader';
import { productService } from '../services/productService';

export const CreateListingPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    brand: '',
    price: '',
    negotiable: false,
    condition: 'Good',
    description: '',
    city: 'Bengaluru',
    locality: '',
  });

  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  // Get available subcategories based on selected category
  const selectedCategoryObj = CATEGORIES.find((c) => c.slug === formData.category);
  const subcategories = selectedCategoryObj ? selectedCategoryObj.subcategories : [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Please enter a descriptive product title.';
    if (!formData.category) errs.category = 'Please choose a category.';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Please provide a valid price.';
    if (!formData.condition) errs.condition = 'Please select the item condition.';
    if (!formData.description.trim() || formData.description.length < 20) {
      errs.description = 'Please describe the item (at least 20 characters).';
    }
    if (!formData.city) errs.city = 'Please select a city.';
    if (images.length === 0) errs.images = 'Please upload at least one image of your item.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setApiError('');

      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('subcategory', formData.subcategory);
      data.append('brand', formData.brand);
      data.append('price', formData.price);
      data.append('negotiable', formData.negotiable);
      data.append('condition', formData.condition);
      data.append('description', formData.description);
      data.append('city', formData.city);
      data.append('locality', formData.locality);
      data.append('thumbnailIndex', coverIndex);

      // Append files
      images.forEach((img) => {
        if (img.file) {
          data.append('images', img.file);
        }
      });

      const res = await productService.createProduct(data);
      if (res.success && res.product) {
        navigate(`/products/${res.product._id}`);
      }
    } catch (err) {
      setApiError(err.message || 'Failed to publish listing. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick 2-Minute Listing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
          Post an item on ReLoop
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Give your pre-owned goods a second life and connect with local buyers directly.
        </p>
      </div>

      {apiError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Photos */}
        <div className="card-base p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <Tag className="w-4 h-4 text-brand-800" />
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              1. Product Photos
            </h2>
          </div>

          <ImageUploader
            images={images}
            onChange={(imgs) => {
              setImages(imgs);
              if (errors.images) setErrors((prev) => ({ ...prev, images: '' }));
            }}
            coverIndex={coverIndex}
            onSelectCover={setCoverIndex}
            maxImages={8}
          />
          {errors.images && <p className="text-xs text-rose-600 font-medium">{errors.images}</p>}
        </div>

        {/* Section 2: Details */}
        <div className="card-base p-6 bg-white space-y-5">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <FileText className="w-4 h-4 text-brand-800" />
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              2. Listing Details
            </h2>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Apple MacBook Air M2 16GB / 512GB Space Grey"
              className="input-field"
              maxLength={120}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>}
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Subcategory (Optional)
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                disabled={subcategories.length === 0}
                className="input-field disabled:bg-zinc-50"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Brand & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Brand / Manufacturer (Optional)
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Sony, Apple, IKEA, Decathlon"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Condition <span className="text-rose-500">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="input-field"
              >
                {CONDITIONS.filter((c) => c.value !== 'All').map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label} — {c.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe condition, usage history, included accessories, reason for selling, and warranty details..."
              className="input-field resize-y"
              maxLength={4000}
            />
            <div className="flex justify-between items-center mt-1 text-[11px] text-zinc-400">
              {errors.description ? (
                <span className="text-rose-600 font-medium">{errors.description}</span>
              ) : (
                <span>Provide as much detail as possible to build trust with buyers</span>
              )}
              <span>{formData.description.length}/4000</span>
            </div>
          </div>
        </div>

        {/* Section 3: Price & Location */}
        <div className="card-base p-6 bg-white space-y-5">
          <div className="flex items-center gap-2 border-b border-surface-border pb-3">
            <DollarSign className="w-4 h-4 text-brand-800" />
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              3. Pricing & Location
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Price in INR (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 18500"
                  min="0"
                  className="input-field pl-8"
                />
              </div>
              {errors.price && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.price}</p>}
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleChange}
                  className="w-4 h-4 text-brand-800 focus:ring-brand-700 rounded"
                />
                <span className="text-xs font-semibold text-zinc-800">
                  Price is negotiable for fast pickup
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                City <span className="text-rose-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input-field"
              >
                {CITIES.filter((c) => c !== 'All Cities').map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Locality / Area (Optional)
              </label>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="e.g. Indiranagar, Bandra West, Whitefield"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="btn-secondary text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-sm px-8 py-3 flex items-center gap-2 shadow-soft-lg"
          >
            <span>{loading ? 'Publishing Listing...' : 'Publish Listing Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListingPage;
