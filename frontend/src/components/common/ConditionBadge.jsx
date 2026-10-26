import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const ConditionBadge = ({ condition, size = 'sm', showIcon = true }) => {
  const getBadgeConfig = (cond) => {
    switch (cond) {
      case 'Like New':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: Sparkles,
          label: 'Like New',
        };
      case 'Good':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: CheckCircle2,
          label: 'Good Condition',
        };
      case 'Fair':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: AlertCircle,
          label: 'Fair Condition',
        };
      default:
        return {
          bg: 'bg-zinc-100 text-zinc-700 border-zinc-200',
          icon: CheckCircle2,
          label: cond || 'Pre-owned',
        };
    }
  };

  const config = getBadgeConfig(condition);
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${sizeClasses[size] || sizeClasses.sm}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};

export default ConditionBadge;
