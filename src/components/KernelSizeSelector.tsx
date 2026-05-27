import { useAffineStore } from '@/store/useAffineStore';
import { Grid3X3 } from 'lucide-react';

export default function KernelSizeSelector() {
  const kernelSize = useAffineStore((s) => s.kernelSize);
  const setKernelSize = useAffineStore((s) => s.setKernelSize);

  const sizes = [3, 5, 7];

  return (
    <div className="panel-card">
      <div className="slider-label mb-3 uppercase tracking-wider text-[10px]">
        卷积核大小 Kernel Size
      </div>
      <div className="flex items-center gap-2">
        <Grid3X3 className="w-4 h-4 text-[#8b949e]" />
        <div className="flex gap-1.5">
          {sizes.map((size) => (
            <button
              key={size}
              className={`preset-btn font-mono ${kernelSize === size ? 'active' : ''}`}
              onClick={() => setKernelSize(size)}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}