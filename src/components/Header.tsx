import { Sigma } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center gap-3 px-6 py-4 border-b border-[#21262d] bg-[#161b22]">
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#0d1117] border border-[#30363d]">
        <Sigma className="w-4 h-4 text-[#58a6ff]" />
      </div>
      <div>
        <h1 className="text-base font-semibold text-[#e6edf3] font-serif tracking-tight">
          仿射变换与卷积采样可视化
        </h1>
        <p className="text-[11px] text-[#8b949e] font-mono">
          Affine Transformation &amp; Convolution Sampling Grid Visualization
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-[10px] text-[#484f58] font-mono uppercase tracking-wider">
          Research Visualization Tool
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
      </div>
    </header>
  );
}