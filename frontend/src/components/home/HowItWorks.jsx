import React from 'react';
import { Camera, MessageSquareText, Sparkles } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Snap & Post',
      description: 'Take clear photos of your pre-loved item, set your desired price, and list in under 60 seconds.',
      icon: Camera,
    },
    {
      step: '02',
      title: 'Chat in Real-Time',
      description: 'Negotiate price and meet-up logistics directly with local verified buyers via secure built-in chat.',
      icon: MessageSquareText,
    },
    {
      step: '03',
      title: 'ReLoop & Celebrate',
      description: 'Exchange safely, get paid, and celebrate giving your item a second life while earning money.',
      icon: Sparkles,
    },
  ];

  return (
    <section className="my-16 py-12 px-6 sm:px-12 rounded-3xl bg-slate-50/70 border border-slate-200/80 shadow-soft-sm">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          How ReLoop Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          The easiest and safest way to buy and sell pre-owned goods in India
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="relative flex flex-col items-center text-center">
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-center justify-center text-emerald-700">
                  <Icon className="w-8 h-8" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[11px] font-black flex items-center justify-center shadow-md shadow-emerald-900/20">
                  {s.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs">{s.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
