import { presets } from '@/utils/affine';
import { useAffineStore } from '@/store/useAffineStore';

export default function PresetPanel() {
  const activePreset = useAffineStore((s) => s.activePreset);
  const applyPreset = useAffineStore((s) => s.applyPreset);

  return (
    <div className="panel-card">
      <div className="slider-label mb-3 uppercase tracking-wider text-[10px]">
        预设变换 Presets
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(presets).map(([key, preset]) => (
          <button
            key={key}
            className={`preset-btn ${activePreset === key ? 'active' : ''}`}
            onClick={() => applyPreset(key)}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
}