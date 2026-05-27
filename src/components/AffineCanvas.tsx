import { useCallback, useEffect, useRef } from 'react';
import { useAffineStore } from '@/store/useAffineStore';
import { transformPoint, generateSamplePoints } from '@/utils/affine';

const CANVAS_SIZE = 400;
const GRID_SPACING = 40;
const POINT_RADIUS = 6;
const ORIGINAL_COLOR = '#58a6ff';
const TRANSFORMED_COLOR = '#f0883e';
const GRID_COLOR = '#21262d';
const AXIS_COLOR = '#30363d';
const CONNECTION_COLOR = 'rgba(139, 148, 158, 0.25)';
const KERNEL_BOX_COLOR = 'rgba(88, 166, 255, 0.12)';

function drawGrid(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 0.5;
  ctx.setLineDash([4, 4]);

  for (let i = cx % GRID_SPACING; i < CANVAS_SIZE; i += GRID_SPACING) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, CANVAS_SIZE);
    ctx.stroke();
  }

  for (let j = cy % GRID_SPACING; j < CANVAS_SIZE; j += GRID_SPACING) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(CANVAS_SIZE, j);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

function drawAxes(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.strokeStyle = AXIS_COLOR;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(CANVAS_SIZE, cy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, CANVAS_SIZE);
  ctx.stroke();

  ctx.fillStyle = '#8b949e';
  ctx.font = '11px "IBM Plex Mono"';
  ctx.textAlign = 'center';

  for (let i = -4; i <= 4; i++) {
    if (i === 0) continue;
    const gx = cx + i * GRID_SPACING;
    const gy = cy - i * GRID_SPACING;
    if (gx > 10 && gx < CANVAS_SIZE - 10) {
      ctx.fillText(String(i), gx, cy + 15);
    }
    if (gy > 10 && gy < CANVAS_SIZE - 10) {
      ctx.fillText(String(i), cx - 18, gy + 4);
    }
  }

  ctx.fillText('O', cx + 12, cy + 15);
}

function drawPoints(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number; id: number; label: string }[],
  color: string,
  drawLabels: boolean,
) {
  for (const pt of points) {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, POINT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#0d1117';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (drawLabels) {
      ctx.fillStyle = '#8b949e';
      ctx.font = '9px "IBM Plex Mono"';
      ctx.textAlign = 'left';
      ctx.fillText(pt.label, pt.x + POINT_RADIUS + 3, pt.y - POINT_RADIUS - 3);
    }
  }
}

function drawConnections(
  ctx: CanvasRenderingContext2D,
  originals: { x: number; y: number }[],
  transformed: { x: number; y: number }[],
) {
  ctx.strokeStyle = CONNECTION_COLOR;
  ctx.lineWidth = 0.8;
  ctx.setLineDash([3, 3]);

  for (let i = 0; i < originals.length; i++) {
    ctx.beginPath();
    ctx.moveTo(originals[i].x, originals[i].y);
    ctx.lineTo(transformed[i].x, transformed[i].y);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

function drawKernelBox(ctx: CanvasRenderingContext2D, cx: number, cy: number, kernelSize: number, spacing: number) {
  const half = (kernelSize * spacing) / 2;
  const x = cx - half;
  const y = cy - half;

  ctx.fillStyle = KERNEL_BOX_COLOR;
  ctx.fillRect(x, y, half * 2, half * 2);

  ctx.strokeStyle = 'rgba(88, 166, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.strokeRect(x, y, half * 2, half * 2);
}

export default function AffineCanvas() {
  const leftRef = useRef<HTMLCanvasElement>(null);
  const rightRef = useRef<HTMLCanvasElement>(null);
  const matrix = useAffineStore((s) => s.matrix);
  const kernelSize = useAffineStore((s) => s.kernelSize);

  const render = useCallback(() => {
    const leftCtx = leftRef.current?.getContext('2d');
    const rightCtx = rightRef.current?.getContext('2d');
    if (!leftCtx || !rightCtx) return;

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;
    const spacing = GRID_SPACING;
    const samplePoints = generateSamplePoints(kernelSize, spacing);

    [leftCtx, rightCtx].forEach((ctx) => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = '#161b22';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      drawGrid(ctx, cx, cy);
      drawAxes(ctx, cx, cy);
    });

    drawKernelBox(leftCtx, cx, cy, kernelSize, spacing);

    const originalCoords = samplePoints.map((p) => ({
      x: cx + p.x,
      y: cy - p.y,
      id: p.id,
      label: p.label,
    }));

    drawPoints(leftCtx, originalCoords, ORIGINAL_COLOR, true);

    const transformedCoords = samplePoints.map((p) => {
      const [tx, ty] = transformPoint(p.x, p.y, matrix);
      return {
        x: cx + tx,
        y: cy - ty,
        id: p.id,
        label: p.label,
      };
    });

    const txMin = Math.min(...transformedCoords.map((p) => p.x));
    const txMax = Math.max(...transformedCoords.map((p) => p.x));
    const tyMin = Math.min(...transformedCoords.map((p) => p.y));
    const tyMax = Math.max(...transformedCoords.map((p) => p.y));

    rightCtx.fillStyle = KERNEL_BOX_COLOR;
    rightCtx.fillRect(txMin, tyMin, txMax - txMin, tyMax - tyMin);
    rightCtx.strokeStyle = 'rgba(240, 136, 62, 0.3)';
    rightCtx.lineWidth = 1;
    rightCtx.setLineDash([4, 4]);
    rightCtx.strokeRect(txMin, tyMin, txMax - txMin, tyMax - tyMin);
    rightCtx.setLineDash([]);

    drawPoints(rightCtx, transformedCoords, TRANSFORMED_COLOR, true);

    drawConnections(
      rightCtx,
      originalCoords.map((p) => ({ x: p.x, y: p.y })),
      transformedCoords.map((p) => ({ x: p.x, y: p.y })),
    );

    drawPoints(rightCtx, originalCoords.map((p) => ({ x: p.x, y: p.y, id: p.id, label: '' })), ORIGINAL_COLOR, false);
  }, [matrix, kernelSize]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="flex gap-4 flex-1 min-h-0 p-4">
      <div className="flex-1 flex flex-col items-center min-w-0">
        <div className="canvas-container w-full max-w-[420px]">
          <canvas ref={leftRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="w-full h-auto" />
        </div>
        <span className="text-[11px] text-[#8b949e] mt-2 font-mono tracking-wide">
          原始采样网格 Original Grid
        </span>
      </div>
      <div className="flex items-center justify-center px-1">
        <div className="w-8 h-px bg-[#30363d]" />
        <svg width="16" height="16" viewBox="0 0 16 16" className="mx-1">
          <path d="M3 8h10M10 4l4 4-4 4" stroke="#58a6ff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="w-8 h-px bg-[#30363d]" />
      </div>
      <div className="flex-1 flex flex-col items-center min-w-0">
        <div className="canvas-container w-full max-w-[420px]">
          <canvas ref={rightRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="w-full h-auto" />
        </div>
        <span className="text-[11px] text-[#8b949e] mt-2 font-mono tracking-wide">
          仿射变换后网格 Transformed Grid
        </span>
      </div>
    </div>
  );
}