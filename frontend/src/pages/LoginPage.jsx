import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card-base p-8 sm:p-10 bg-white shadow-soft-xl">
          {/* Logo & Headline */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:shadow-emerald-600/40 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-5 h-5"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              </div>
              <span className="text-2xl font-black text-slate-900">
                Re<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Loop</span>
              </span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Sign in to manage your listings and chat with buyers
            </p>
          </div>

          {/* Quick Demo Credentials helper */}
          <div className="mb-6 p-3 rounded-xl bg-brand-50 border border-brand-200 text-[11px] text-brand-900 space-y-1">
            <p className="font-bold">✨ Demo Test Account:</p>
            <p>
              Email: <code className="font-mono bg-white px-1 py-0.5 rounded border border-brand-200">aarav@example.com</code>
            </p>
            <p>
              Password: <code className="font-mono bg-white px-1 py-0.5 rounded border border-brand-200">password123</code>
            </p>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-6 border-t border-surface-border text-center text-xs text-zinc-500">
            Don&apos;t have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-800 hover:text-brand-900 underline">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
