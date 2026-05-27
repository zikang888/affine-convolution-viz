import { KeyboardEvent } from 'react';
import { useAffineStore } from '@/store/useAffineStore';

export default function MatrixDisplay() {
  const matrix = useAffineStore((s) => s.matrix);
  const setMatrixValue = useAffineStore((s) => s.setMatrixValue);
  const recomputeMatrix = useAffineStore((s) => s.recomputeMatrix);

  const cells: { label: string; row: number; col: number; value: number }[] = [
    { label: 'a', row: 0, col: 0, value: matrix.a },
    { label: 'b', row: 0, col: 1, value: matrix.b },
    { label: 't_x', row: 0, col: 2, value: matrix.c },
    { label: 'd', row: 1, col: 0, value: matrix.d },
    { label: 'e', row: 1, col: 1, value: matrix.e },
    { label: 't_y', row: 1, col: 2, value: matrix.f },
  ];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      recomputeMatrix();
      (e.target as HTMLInputElement).blur();
    }
  };

  const matrixRows = [
    { row: 0, cols: [0, 1, 2] },
    { row: 1, cols: [0, 1, 2] },
    { row: 2, cols: [0, 1, 2] },
  ];

  const getCellValue = (r: number, c: number): string => {
    const cell = cells.find((x) => x.row === r && x.col === c);
    if (!cell) {
      if (r === 2 && c === 0) return '0';
      if (r === 2 && c === 1) return '0';
      if (r === 2 && c === 2) return '1';
    }
    return cell ? cell.value.toFixed(2) : '0';
  };

  const isEditable = (r: number, c: number) => {
    return !(r === 2);
  };

  return (
    <div className="panel-card">
      <div className="slider-label mb-3 uppercase tracking-wider text-[10px]">
        仿射矩阵 Affine Matrix
      </div>
      <div className="flex flex-col items-center gap-1">
        {matrixRows.map((row) => (
          <div key={row.row} className="flex items-center gap-1">
            {row.cols.map((col) => {
              const editable = isEditable(row.row, col);
              const cell = cells.find((x) => x.row === row.row && x.col === col);
              return (
                <input
                  key={col}
                  type="number"
                  className="matrix-cell"
                  value={getCellValue(row.row, col)}
                  step={0.01}
                  readOnly={!editable}
                  onKeyDown={editable ? handleKeyDown : undefined}
                  onChange={(e) => {
                    if (!editable || !cell) return;
                    setMatrixValue(cell.row, cell.col, parseFloat(e.target.value) || 0);
                  }}
                  style={{
                    color: !editable ? '#484f58' : row.row === 0 && col === 2 ? '#f0883e' : row.row === 1 && col === 2 ? '#f0883e' : row.row === 0 ? '#58a6ff' : row.row === 1 ? '#3fb950' : '#484f58',
                    cursor: editable ? 'text' : 'default',
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center">
        <button
          onClick={recomputeMatrix}
          className="text-[10px] text-[#58a6ff] hover:text-[#79c0ff] transition-colors font-mono uppercase tracking-wider"
        >
          Recompute from params
        </button>
      </div>
      <div className="mt-2 text-center text-[9px] text-[#484f58] font-mono">
        <div className="flex justify-center gap-3">
          <span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#58a6ff] mr-1 align-middle" />
            旋转/缩放/剪切
          </span>
          <span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#f0883e] mr-1 align-middle" />
            平移
          </span>
        </div>
      </div>
    </div>
  );
}