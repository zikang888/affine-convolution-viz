import type { AffineParams } from '@/utils/affine';
import { useAffineStore } from '@/store/useAffineStore';

interface SliderConfig {
  key: keyof AffineParams;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

const sliders: SliderConfig[] = [
  { key: 'rotation', label: '旋转角 θ', unit: '°', min: -180, max: 180, step: 1, format: (v) => `${v.toFixed(0)}°` },
  { key: 'scaleX', label: '缩放 X', unit: '', min: 0.1, max: 3, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'scaleY', label: '缩放 Y', unit: '', min: 0.1, max: 3, step: 0.05, format: (v) => v.toFixed(2) },
  { key: 'shearX', label: '剪切 X', unit: '', min: -1, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
  { key: 'shearY', label: '剪切 Y', unit: '', min: -1, max: 1, step: 0.01, format: (v) => v.toFixed(2) },
  { key: 'translateX', label: '平移 X', unit: 'px', min: -150, max: 150, step: 1, format: (v) => `${v.toFixed(0)}` },
  { key: 'translateY', label: '平移 Y', unit: 'px', min: -150, max: 150, step: 1, format: (v) => `${v.toFixed(0)}` },
];

export default function ParamSliders() {
  const params = useAffineStore((s) => s.params);
  const setParam = useAffineStore((s) => s.setParam);

  return (
    <div className="panel-card">
      <div className="slider-label mb-3 uppercase tracking-wider text-[10px]">
        变换参数 Parameters
      </div>
      <div className="space-y-3">
        {sliders.map((slider) => {
          let value = params[slider.key];
          if (slider.key === 'rotation') {
            value = (value * 180) / Math.PI;
          }

          return (
            <div key={slider.key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-[#8b949e] font-mono">{slider.label}</span>
                <span className="text-[11px] text-[#58a6ff] font-mono tabular-nums">
                  {slider.format(value)}
                </span>
              </div>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={value}
                onChange={(e) => {
                  let v = parseFloat(e.target.value);
                  if (slider.key === 'rotation') {
                    v = (v * Math.PI) / 180;
                  }
                  setParam(slider.key, v);
                }}
                className="w-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}