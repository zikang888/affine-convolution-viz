import Header from '@/components/Header';
import AffineCanvas from '@/components/AffineCanvas';
import ParamSliders from '@/components/ParamSliders';
import MatrixDisplay from '@/components/MatrixDisplay';
import PresetPanel from '@/components/PresetPanel';
import KernelSizeSelector from '@/components/KernelSizeSelector';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#0d1117]">
      <Header />
      <div className="flex flex-1 min-h-0">
        <aside className="w-[300px] flex-shrink-0 border-r border-[#21262d] bg-[#0d1117] overflow-y-auto p-4 flex flex-col gap-3">
          <ParamSliders />
          <MatrixDisplay />
          <KernelSizeSelector />
          <PresetPanel />
          <div className="mt-auto pt-3 border-t border-[#21262d]">
            <p className="text-[9px] text-[#484f58] font-mono leading-relaxed">
              仿射变换矩阵为 3×3 齐次坐标形式。<br />
              所有变换均可自由组合，观察坐标映射关系。<br />
              青色圆点 = 原始采样点，橙色圆点 = 变换后采样点。
            </p>
          </div>
        </aside>
        <main className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
          <AffineCanvas />
        </main>
      </div>
    </div>
  );
}