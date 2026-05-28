# 仿射变换与卷积采样可视化

交互式可视化网站，直观展示卷积神经网络中仿射变换（Affine Transformation）对采样坐标的影响。用户可通过调节仿射变换矩阵参数，实时观察卷积核采样点在二维平面上的几何变形。

---

## 使用方法

### 前置要求

- 安装 [Node.js](https://nodejs.org)（18 或以上版本）

### 拉取项目

```bash
git clone https://github.com/zikang888/affine-convolution-viz.git
cd affine-convolution-viz
```

### 安装与启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:5173/` 即可使用。

> **注意**：如果使用 pnpm，首次安装时需先执行 `pnpm approve-builds` 允许 esbuild 构建脚本，再运行 `pnpm install` 和 `pnpm run dev`。

---

## 核心功能

- **仿射变换控制面板** — 6 个参数滑块：旋转角度、X/Y 缩放、X/Y 剪切、X/Y 平移，支持独立或组合调节
- **双视图坐标可视化** — 左侧展示原始规则采样网格（青色），右侧展示仿射变换后变形网格（橙色），虚线箭头连接展示坐标映射关系
- **矩阵实时显示** — 3×3 齐次坐标仿射矩阵，支持手动编辑数值，彩色区分旋转/缩放（蓝色）、平移（橙色）
- **预设变换模式** — 7 种预设：恒等变换、旋转 30°、放大 1.5×、X 剪切、Y 剪切、平移、组合变换
- **卷积核大小切换** — 支持 3×3 / 5×5 / 7×7 采样网格规模

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 样式方案 | Tailwind CSS 3 |
| 状态管理 | Zustand |
| 图标 | lucide-react |
| 构建工具 | Vite |
| Canvas | 原生 HTML5 Canvas API |
| 后端 | 无（纯前端，所有计算在浏览器端完成） |

---

## 设计风格

- **整体风格**：科学研究风格 — 简洁、精确、去装饰化，以数据可视化为中心
- **主色调**：深色背景 (#0d1117) + 青蓝色强调 (#58a6ff, #3fb950) + 暖橙色辅助 (#f0883e)
- **字体**：IBM Plex Serif（标题）+ IBM Plex Mono（正文/数据）
- **布局**：左侧 300px 控制面板 + 右侧自适应双视图 Canvas

---

## 项目结构

```
src/
├── utils/affine.ts              # 仿射变换计算（矩阵合成、坐标变换、采样点生成）
├── store/useAffineStore.ts      # Zustand 全局状态管理
├── components/
│   ├── Header.tsx               # 顶部标题栏
│   ├── AffineCanvas.tsx         # 双视图 Canvas 渲染引擎
│   ├── ParamSliders.tsx         # 6 个参数滑块面板
│   ├── MatrixDisplay.tsx        # 3×3 矩阵显示与编辑
│   ├── PresetPanel.tsx          # 预设变换按钮组
│   └── KernelSizeSelector.tsx   # 卷积核大小选择器
└── pages/Home.tsx               # 主页面布局
```

---

## 数据模型

```typescript
interface AffineParams {
  rotation: number;    // 旋转角度（弧度）
  scaleX: number;      // X 轴缩放
  scaleY: number;      // Y 轴缩放
  shearX: number;      // X 轴剪切
  shearY: number;      // Y 轴剪切
  translateX: number;  // X 轴平移
  translateY: number;  // Y 轴平移
}

interface AffineMatrix {
  a: number;  // m11
  b: number;  // m12
  c: number;  // m13 (tx)
  d: number;  // m21
  e: number;  // m22
  f: number;  // m23 (ty)
}
```

---

## Canvas 可视化要素

- 坐标系以画布中心为原点，x 轴向右、y 轴向上（数学坐标约定）
- 浅色虚线网格，青色圆点为原始采样点，橙色圆点为变换后采样点
- 虚线箭头连接原始点与变换点，展示坐标映射关系
- 半透明矩形框标记卷积核采样区域