import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Calendar,
  Package,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  Archive,
  AlertCircle,
  PlusCircle,
  Heart,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { productService } from '../services/productService';
import { formatPrice, timeAgo, formatJoinDate } from '../utils/helpers';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { CITIES } from '../utils/categories';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'active');
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, reserved: 0, sold: 0 });
  const [loading, setLoading] = useState(true);

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || 'Bengaluru',
    locality: user?.locality || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Delete Confirm Dialog State
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getMyProducts(activeTab === 'all' ? undefined : activeTab);
      if (res.success) {
        setProducts(res.products || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load my listings:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await productService.updateProductStatus(productId, newStatus);
      fetchMyProducts();
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  const handleDeleteListing = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await productService.deleteProduct(deleteId);
      setDeleteId(null);
      fetchMyProducts();
    } catch (err) {
      console.error('Failed to delete listing:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await userService.updateProfile(profileForm);
      if (res.success && res.user) {
        updateUser(res.user);
        setIsEditingProfile(false);
        setProfileSuccess('Profile updated successfully!');
        setTimeout(() => setProfileSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Profile Overview Card */}
      <div className="card-base p-6 sm:p-8 bg-white mb-10 shadow-soft-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={user?.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-brand-200 shadow-soft-sm"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
                {user?.name}
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">{user?.email}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-zinc-500 mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  {user?.city || 'India'}
                  {user?.locality ? `, ${user.locality}` : ''}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  Joined {formatJoinDate(user?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
            </button>
            <Link
              to="/create-listing"
              className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Listing</span>
            </Link>
          </div>
        </div>

        {/* Profile Success Message */}
        {profileSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
            {profileSuccess}
          </div>
        )}

        {/* Edit Profile Form Accordion */}
        {isEditingProfile && (
          <form
            onSubmit={handleProfileSubmit}
            className="mt-6 pt-6 border-t border-surface-border grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">City</label>
              <select
                value={profileForm.city}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                className="input-field"
              >
                {CITIES.filter((c) => c !== 'All Cities').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Locality / Area</label>
              <input
                type="text"
                value={profileForm.locality}
                onChange={(e) => setProfileForm({ ...profileForm, locality: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="btn-primary text-xs"
              >
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}

        {/* User Stats Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-surface-border">
          <div className="p-4 rounded-xl bg-surface-subtle text-center">
            <span className="text-xl sm:text-2xl font-extrabold text-zinc-900 block">
              {stats.total}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Total Listed
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 text-center border border-emerald-100">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-800 block">
              {stats.active}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
              Active Listings
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 text-center border border-amber-100">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-800 block">
              {stats.reserved}
            </span>
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
              Reserved
            </span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-100 text-center">
            <span className="text-xl sm:text-2xl font-extrabold text-zinc-700 block">
              {stats.sold}
            </span>
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Sold & ReLooped
            </span>
          </div>
        </div>
      </div>

      {/* Listings Management Tabs */}
      <div className="mb-6 flex items-center justify-between border-b border-surface-border pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {['active', 'reserved', 'sold', 'all'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-brand-800 text-white shadow-soft-sm'
                  : 'bg-white text-zinc-600 hover:bg-surface-subtle border border-surface-border'
              }`}
            >
              {tab === 'active' && `Active (${stats.active})`}
              {tab === 'reserved' && `Reserved (${stats.reserved})`}
              {tab === 'sold' && `Sold (${stats.sold})`}
              {tab === 'all' && `All (${stats.total})`}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table / Cards */}
      {loading ? (
        <div className="py-12 text-center text-zinc-400">Loading your listings...</div>
      ) : products.length === 0 ? (
        <div className="card-base p-12 text-center max-w-md mx-auto">
          <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900 mb-1">No listings found in this tab</h3>
          <p className="text-xs text-zinc-500 mb-5">
            You don&apos;t have any {activeTab !== 'all' ? activeTab : ''} listings currently.
          </p>
          <Link to="/create-listing" className="btn-primary text-xs">
            + Create a Listing
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((item) => (
            <div
              key={item._id}
              className="card-base p-4 sm:p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-soft-md transition-shadow"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={item.thumbnail || item.images?.[0]?.url || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=100'}
                  alt={item.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-surface-border flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : item.status === 'reserved'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-zinc-900 text-white'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs text-zinc-400">•</span>
                    <span className="text-xs text-zinc-500">{item.category}</span>
                  </div>

                  <Link
                    to={`/products/${item._id}`}
                    className="text-sm font-bold text-zinc-900 hover:text-brand-800 truncate block max-w-md"
                  >
                    {item.title}
                  </Link>

                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                    <span className="font-extrabold text-brand-900">{formatPrice(item.price)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.views || 0} views
                    </span>
                    <span>•</span>
                    <span>{timeAgo(item.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Status & Action Controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-surface-border">
                {/* Status Toggle Dropdown */}
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-surface-border bg-surface-subtle"
                >
                  <option value="active">Mark Active</option>
                  <option value="reserved">Mark Reserved</option>
                  <option value="sold">Mark as Sold</option>
                </select>

                <Link
                  to={`/edit-listing/${item._id}`}
                  className="p-2 rounded-xl text-zinc-600 hover:text-brand-800 hover:bg-surface-subtle transition-colors"
                  title="Edit details"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setDeleteId(item._id)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog for Deleting Listing */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete this listing?"
        message="Are you sure you want to permanently delete this listing? All photos and buyer messages associated with it will be removed."
        confirmText="Delete Listing"
        loading={deleting}
        onConfirm={handleDeleteListing}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default ProfilePage;
