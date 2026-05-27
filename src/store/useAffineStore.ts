import { create } from 'zustand';
import type { AffineParams, AffineMatrix } from '@/utils/affine';
import { paramsToMatrix, presets } from '@/utils/affine';

const defaultParams: AffineParams = {
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  shearX: 0,
  shearY: 0,
  translateX: 0,
  translateY: 0,
};

interface AffineState {
  params: AffineParams;
  matrix: AffineMatrix;
  kernelSize: number;
  activePreset: string;
  setParam: (key: keyof AffineParams, value: number) => void;
  setMatrixValue: (row: number, col: number, value: number) => void;
  setKernelSize: (size: number) => void;
  applyPreset: (presetKey: string) => void;
  recomputeMatrix: () => void;
}

export const useAffineStore = create<AffineState>((set, get) => ({
  params: { ...defaultParams },
  matrix: paramsToMatrix(defaultParams),
  kernelSize: 3,
  activePreset: 'identity',

  setParam: (key, value) => {
    const params = { ...get().params, [key]: value };
    set({ params, matrix: paramsToMatrix(params), activePreset: 'custom' });
  },

  setMatrixValue: (row, col, value) => {
    const matrix = { ...get().matrix };
    const keys: (keyof AffineMatrix)[][] = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ];
    matrix[keys[row][col]] = value;
    set({ matrix });
  },

  setKernelSize: (size) => {
    set({ kernelSize: size });
  },

  applyPreset: (presetKey) => {
    const preset = presets[presetKey];
    if (preset) {
      set({
        params: { ...preset.params },
        matrix: paramsToMatrix(preset.params),
        activePreset: presetKey,
      });
    }
  },

  recomputeMatrix: () => {
    set({ matrix: paramsToMatrix(get().params) });
  },
}));