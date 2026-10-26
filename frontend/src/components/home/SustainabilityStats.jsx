import React from 'react';
import { Leaf, Droplets, Banknote, RefreshCw } from 'lucide-react';

export const SustainabilityStats = () => {
  const stats = [
    {
      label: 'Products ReLooped',
      value: '14,800+',
      description: 'Kept out of landfills across India',
      icon: RefreshCw,
      color: 'text-brand-800 bg-brand-50 border-brand-200',
    },
    {
      label: 'CO₂ Emissions Prevented',
      value: '58 Tonnes',
      description: 'Equivalent to planting 2,900 trees',
      icon: Leaf,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Water Conserved',
      value: '420,000 L',
      description: 'Saved from manufacturing new goods',
      icon: Droplets,
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    },
    {
      label: 'Saved by Community',
      value: '₹2.4 Crore',
      description: 'Pocket savings vs retail MSRP',
      icon: Banknote,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
  ];

  return (
    <section className="my-16">
      <div className="card-base p-8 sm:p-12 bg-white border border-slate-200/90 shadow-soft-lg relative overflow-hidden">
        {/* Subtle decorative glow accents */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conscious Circular Impact</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Good for your wallet. Better for the planet.
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm font-medium leading-relaxed">
            Every item purchased second-hand avoids carbon emissions, raw resource extraction, and industrial manufacturing waste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 hover:shadow-soft transition-all duration-300 flex flex-col justify-between"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border shadow-sm ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
                    {s.value}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    {s.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SustainabilityStats;
