import React from 'react';
import { getFeatureDef } from '../propertyFeatures';

const PropertyFeaturesDisplay: React.FC<{ features?: string[] }> = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {features.map((key) => {
        const def = getFeatureDef(key);
        if (!def) return null;
        return (
          <div key={key} className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-3 text-center">
            <span className="material-symbols-outlined text-xl text-primary">{def.icon}</span>
            <span className="text-[11px] font-semibold text-slate-600">{def.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyFeaturesDisplay;
