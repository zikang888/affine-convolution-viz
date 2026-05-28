# 仿射变换与卷积采样可视化

交互式可视化网站，直观展示卷积神经网络中仿射变换（Affine Transformation）对采样坐标的影响。用户可通过调节仿射变换矩阵参数，实时观察卷积核采样点在二维平面上的几何变形。

---

## 使用方法

### 前置要求

- 安装 [Node.js](https://nodejs.org)（18 或以上版本）

### 安装与启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:5173/` 即可使用。

> **注意**：如果使用 pnpm，首次安装时需先执行 `pnpm approve-builds` 允许 esbuild 构建脚本，再运行 `pnpm install` 和 `pnpm run dev`。