import React from 'react';
import { CryptoCurrency } from '../../types/crypto';

interface CryptoIconProps {
  currency: CryptoCurrency;
  size?: 'sm' | 'md' | 'lg';
}

export const CryptoIcon: React.FC<CryptoIconProps> = ({ currency, size = 'md' }) => {
  const sizeMap = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-9 h-9 text-sm',
  };

  const badgeMap: Record<CryptoCurrency, { bg: string; label: string }> = {
    BTC: { bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', label: '₿' },
    ETH: { bg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40', label: 'Ξ' },
    USDT: { bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', label: '₮' },
    BNB: { bg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40', label: 'B' },
    SOL: { bg: 'bg-purple-500/20 text-purple-400 border-purple-500/40', label: 'S' },
  };

  const style = badgeMap[currency] || { bg: 'bg-slate-800 text-slate-300 border-slate-700', label: currency[0] };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold border shrink-0 ${style.bg} ${sizeMap[size]}`}
      title={currency}
    >
      {style.label}
    </div>
  );
};
