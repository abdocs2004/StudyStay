import React from 'react';

interface ProfileTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChangeTab: (tabId: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ tabs, activeTab, onChangeTab }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChangeTab(tab.id)}
          className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition-colors ${
            activeTab === tab.id
              ? 'bg-primary text-white border-primary'
              : 'bg-surface-container-low text-slate-700 border-transparent hover:bg-surface-container'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
