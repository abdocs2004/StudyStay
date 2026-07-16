import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

interface OwnerStats {
  properties: { total: number; approved: number; pending: number; rejected: number; total_views: number };
  favorites: { total_favorites: number };
  messages: { total_messages: number };
  reviews: { total_reviews: number; average_rating: number };
}

const OwnerDashboardStats: React.FC = () => {
  const [stats, setStats] = useState<OwnerStats | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<OwnerStats>('/properties/owner/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error loading owner stats:', error);
      }
    };
    load();
  }, []);

  if (!stats) return null;

  const cards = [
    { label: 'إجمالي العقارات', value: stats.properties.total, icon: 'apartment' },
    { label: 'معتمدة', value: stats.properties.approved, icon: 'check_circle', accent: 'text-emerald-600 bg-emerald-50' },
    { label: 'قيد المراجعة', value: stats.properties.pending, icon: 'hourglass_empty', accent: 'text-amber-600 bg-amber-50' },
    { label: 'مرفوضة', value: stats.properties.rejected, icon: 'cancel', accent: 'text-rose-600 bg-rose-50' },
    { label: 'المشاهدات', value: stats.properties.total_views, icon: 'visibility' },
    { label: 'المفضلة', value: stats.favorites.total_favorites, icon: 'favorite' },
    { label: 'الرسائل', value: stats.messages.total_messages, icon: 'chat' },
    { label: 'متوسط التقييم', value: stats.reviews.total_reviews > 0 ? `${stats.reviews.average_rating} ★` : '—', icon: 'star' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">{card.label}</p>
              <p className="text-xl font-black text-slate-900 mt-1">{card.value}</p>
            </div>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.accent || 'text-primary bg-primary/10'}`}>
              <span className="material-symbols-outlined text-lg">{card.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OwnerDashboardStats;
