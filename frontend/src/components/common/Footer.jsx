import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, RefreshCw, HeartHandshake } from 'lucide-react';
import { CATEGORIES } from '../../utils/categories';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 sm:mt-24">
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-emerald-50/40 via-teal-50/20 to-slate-50/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Verified Community</h4>
                <p className="text-xs text-slate-500">Real buyers and verified peer sellers</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quality Checked</h4>
                <p className="text-xs text-slate-500">Transparent condition guidelines</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                <RefreshCw className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Circular Economy</h4>
                <p className="text-xs text-slate-500">Reduce waste & extend product life</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                <HeartHandshake className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Direct Chat</h4>
                <p className="text-xs text-slate-500">Fast, direct deal negotiations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/25">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-4 h-4"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
              </div>
              <span className="text-xl font-black text-slate-900">
                Re<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Loop</span>
              </span>
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              ReLoop is India&apos;s conscious second-hand marketplace. We believe good things deserve a second life. By connecting neighborhood buyers and sellers, we keep quality electronics, furniture, books, and lifestyle goods in circulation.
            </p>
            <div className="pt-2 text-xs text-slate-500 font-medium">
              <span>Made with care for a greener tomorrow. 🌱</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/browse?category=${encodeURIComponent(c.slug)}`}
                    className="hover:text-brand-800 transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600">
              <li>
                <Link to="/browse" className="hover:text-brand-800 transition-colors">
                  Explore Listings
                </Link>
              </li>
              <li>
                <Link to="/create-listing" className="hover:text-brand-800 transition-colors">
                  Sell Your Item
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-brand-800 transition-colors">
                  Saved Items
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-brand-800 transition-colors">
                  Messages & Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Trust */}
          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">
              Trust & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600">
              <li>
                <span className="hover:text-brand-800 cursor-pointer">Safety Guidelines</span>
              </li>
              <li>
                <span className="hover:text-brand-800 cursor-pointer">Buyer Protection</span>
              </li>
              <li>
                <span className="hover:text-brand-800 cursor-pointer">Community Rules</span>
              </li>
              <li>
                <span className="hover:text-brand-800 cursor-pointer">Terms & Conditions</span>
              </li>
              <li>
                <span className="hover:text-brand-800 cursor-pointer">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} ReLoop Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-700 cursor-pointer">Terms</span>
            <span className="hover:text-zinc-700 cursor-pointer">Privacy</span>
            <span className="hover:text-zinc-700 cursor-pointer">Cookies</span>
            <span className="hover:text-zinc-700 cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
