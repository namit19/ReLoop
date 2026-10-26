import React, { useState } from 'react';
import { Flag, X, CheckCircle } from 'lucide-react';
import { productService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const REPORT_REASONS = [
  'Prohibited or Illegal Item',
  'Fraud, Scam or Fake Listing',
  'Incorrect Category or Information',
  'Offensive Content or Harassment',
  'Duplicate Listing',
  'Other',
];

export const ReportModal = ({ isOpen, onClose, productId, productTitle }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await productService.reportProduct({
        productId,
        reason,
        details,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="card-base w-full max-w-lg p-6 bg-white shadow-soft-xl relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Report Listing</h3>
            <p className="text-xs text-zinc-500 line-clamp-1">{productTitle}</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-zinc-900 text-base mb-1">Report Submitted</h4>
            <p className="text-xs text-zinc-500">
              Thank you for keeping ReLoop safe. Our trust & safety team will review this listing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Reason for report <span className="text-rose-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-field"
                required
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe why this listing violates community standards..."
                rows={3}
                className="input-field resize-none"
                maxLength={500}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs bg-rose-600 hover:bg-rose-700"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
