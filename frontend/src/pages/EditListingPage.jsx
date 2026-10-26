import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Layers, Tag, DollarSign, FileText } from 'lucide-react';
import { CATEGORIES, CITIES, CONDITIONS } from '../utils/categories';
import { productService } from '../services/productService';

export const EditListingPage = () => {
  const { id } = useParams();
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
    status: 'active',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductById(id);
        if (res.success && res.product) {
          const p = res.product;
          setFormData({
            title: p.title,
            category: p.category,
            subcategory: p.subcategory || '',
            brand: p.brand || '',
            price: p.price,
            negotiable: p.negotiable || false,
            condition: p.condition || 'Good',
            description: p.description,
            city: p.location?.city || 'Bengaluru',
            locality: p.location?.locality || '',
            status: p.status || 'active',
          });
          setExistingImages(p.images || []);
        }
      } catch (err) {
        setApiError(err.message || 'Failed to load listing.');
      } finally {
        setLoading(false);
      }
    };

    fetchExisting();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
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
      data.append('status', formData.status);
      data.append('existingImages', JSON.stringify(existingImages));

      const res = await productService.updateProduct(id, data);
      if (res.success) {
        navigate(`/products/${id}`);
      }
    } catch (err) {
      setApiError(err.message || 'Failed to update listing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-zinc-400">
        Loading listing details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Edit Listing</h1>
        <p className="text-xs text-zinc-500 mt-1">Update price, condition, description, or status.</p>
      </div>

      {apiError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card-base p-6 bg-white space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Listing Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field font-semibold text-xs"
            >
              <option value="active">Active (Available for Buyers)</option>
              <option value="reserved">Reserved (Under Offer)</option>
              <option value="sold">Sold (Completed)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Product Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="input-field"
              >
                {CONDITIONS.filter((c) => c.value !== 'All').map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={saving}
            className="btn-secondary text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-xs"
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListingPage;
