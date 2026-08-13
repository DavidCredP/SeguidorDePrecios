import React from 'react';
import { SmartBadgeType } from '../../types/smartBadges';
import { SMART_BADGES_METADATA } from '../../services/smartBadgeEngine';
import { Sparkles, Coins, Crown, HelpCircle } from 'lucide-react';

interface SmartBadgeTagProps {
  badge: SmartBadgeType;
  reason?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const SmartBadgeTag: React.FC<SmartBadgeTagProps> = ({
  badge,
  reason,
  size = 'md',
  showIcon = true,
}) => {
  const meta = SMART_BADGES_METADATA[badge];
  if (!meta) return null;

  const renderIcon = () => {
    switch (badge) {
      case 'cheapest':
        return <Coins className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />;
      case 'bbb':
        return <Sparkles className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />;
      case 'top_quality':
        return <Crown className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />;
      default:
        return null;
    }
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <div
      className={`group relative inline-flex items-center rounded-full border shadow-sm transition-all duration-200 cursor-help ${meta.colorClass} ${sizeClasses[size]}`}
      title={reason || meta.description}
    >
      {showIcon && renderIcon()}
      <span>{meta.shortLabel}</span>

      {reason && (
        <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900/95 text-slate-200 text-xs rounded-xl shadow-2xl border border-slate-700/80 z-50 pointer-events-none backdrop-blur-md">
          <div className="flex items-center gap-1 text-emerald-400 font-semibold mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>¿Por qué este sello?</span>
          </div>
          <p className="leading-snug text-slate-300">{reason}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95" />
        </div>
      )}
    </div>
  );
};
