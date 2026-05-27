export interface AffineParams {
  rotation: number;
  scaleX: number;
  scaleY: number;
  shearX: number;
  shearY: number;
  translateX: number;
  translateY: number;
}

export interface AffineMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export interface SamplePoint {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface TransformedPoint {
  id: number;
  originalX: number;
  originalY: number;
  transformedX: number;
  transformedY: number;
}

export function paramsToMatrix(params: AffineParams): AffineMatrix {
  const cosR = Math.cos(params.rotation);
  const sinR = Math.sin(params.rotation);

  const a = params.scaleX * cosR - params.scaleX * params.shearY * sinR;
  const b = params.scaleX * params.shearX * cosR - params.scaleY * sinR;
  const d_val = params.scaleY * params.shearY * cosR + params.scaleX * sinR;
  const e_val = params.scaleY * cosR + params.scaleX * params.shearX * sinR;

  return {
    a,
    b,
    c: params.translateX,
    d: d_val,
    e: e_val,
    f: params.translateY,
  };
}

export function transformPoint(x: number, y: number, matrix: AffineMatrix): [number, number] {
  const tx = matrix.a * x + matrix.b * y + matrix.c;
  const ty = matrix.d * x + matrix.e * y + matrix.f;
  return [tx, ty];
}

export function generateSamplePoints(kernelSize: number, spacing: number): SamplePoint[] {
  const points: SamplePoint[] = [];
  const half = Math.floor(kernelSize / 2);
  let id = 0;

  for (let row = -half; row <= half; row++) {
    for (let col = -half; col <= half; col++) {
      points.push({
        id,
        x: col * spacing,
        y: -row * spacing,
        label: `(${col},${row})`,
      });
      id++;
    }
  }

  return points;
}

export const presets: Record<string, { name: string; params: AffineParams }> = {
  identity: {
    name: '恒等变换',
    params: { rotation: 0, scaleX: 1, scaleY: 1, shearX: 0, shearY: 0, translateX: 0, translateY: 0 },
  },
  rotate30: {
    name: '旋转 30°',
    params: { rotation: Math.PI / 6, scaleX: 1, scaleY: 1, shearX: 0, shearY: 0, translateX: 0, translateY: 0 },
  },
  scaleUp: {
    name: '放大 1.5×',
    params: { rotation: 0, scaleX: 1.5, scaleY: 1.5, shearX: 0, shearY: 0, translateX: 0, translateY: 0 },
  },
  shearX: {
    name: 'X 剪切',
    params: { rotation: 0, scaleX: 1, scaleY: 1, shearX: 0.5, shearY: 0, translateX: 0, translateY: 0 },
  },
  shearY: {
    name: 'Y 剪切',
    params: { rotation: 0, scaleX: 1, scaleY: 1, shearX: 0, shearY: 0.5, translateX: 0, translateY: 0 },
  },
  translate: {
    name: '平移',
    params: { rotation: 0, scaleX: 1, scaleY: 1, shearX: 0, shearY: 0, translateX: 50, translateY: 30 },
  },
  combined: {
    name: '组合变换',
    params: { rotation: Math.PI / 8, scaleX: 1.3, scaleY: 0.8, shearX: 0.3, shearY: 0, translateX: 20, translateY: -15 },
  },
};