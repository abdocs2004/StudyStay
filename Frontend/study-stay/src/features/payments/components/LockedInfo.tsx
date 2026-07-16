import React from 'react';

interface LockedInfoProps {
  label: string;
  onUnlockClick: () => void;
}

const LockedInfo: React.FC<LockedInfoProps> = ({ label, onUnlockClick }) => (
  <button
    type="button"
    onClick={onUnlockClick}
    className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-200 transition-colors w-full text-right"
  >
    <span className="material-symbols-outlined text-base">lock</span>
    فتح {label}
  </button>
);

export default LockedInfo;
