import React from 'react';
import { PROPERTY_FEATURES } from '../propertyFeatures';

interface PropertyFeaturesPickerProps {
  selected: string[];
  onChange: (features: string[]) => void;
}

const PropertyFeaturesPicker: React.FC<PropertyFeaturesPickerProps> = ({ selected, onChange }) => {
  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {PROPERTY_FEATURES.map((feature) => {
        const isActive = selected.includes(feature.key);
        return (
          <button
            key={feature.key}
            type="button"
            onClick={() => toggle(feature.key)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors ${
              isActive ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{feature.icon}</span>
            <span className="text-[11px] font-semibold">{feature.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PropertyFeaturesPicker;
