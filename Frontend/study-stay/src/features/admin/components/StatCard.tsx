import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  accent?: string;
  sub?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent = 'bg-primary/10 text-primary', sub }) => (
  <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
  </div>
);

export default StatCard;
