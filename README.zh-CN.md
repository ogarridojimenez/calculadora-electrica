# CalcEléc - 专业电气计算器

<div align="center">

![CalcEléc Logo](https://img.shields.io/badge/CalcEléc-电气计算器-0891b2?style=for-the-badge&logo=electrical&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**基于古巴电气标准（NC 800、NC 801、NC 802、NC 803 和 NC 804）的古巴电气工程师专业电气计算工具。**

[English](./README-en.md) · [Español](./README.md)

</div>

---

## 目录

- [功能特点](#-功能特点)
- [可用计算](#-可用计算)
- [古巴标准](#-古巴标准)
- [系统要求](#-系统要求)
- [安装](#-安装)
- [使用](#-使用)
- [项目结构](#-项目结构)
- [技术栈](#-技术栈)
- [贡献](#-贡献)
- [许可证](#-许可证)

---

## ✨ 功能特点

- **8个专业计算器**：欧姆定律、单相/三相功率、电压降、导线截面、保护、接地、功率因数
- **输入验证**：所有输入字段的健壮验证
- **响应式设计**：适用于桌面和移动设备
- **专业界面**：面向电气工程师的现代设计
- **古巴标准**：古巴NC电气标准的忠实实现
- **TypeScript代码**：静态类型以提高安全性和可维护性
- **单元测试**：27+个计算函数单元测试

---

## 📐 可用计算

### 基本计算

| 计算 | 公式 | 描述 |
|------|------|------|
| **欧姆定律** | V = I × R | 计算电压、电流或电阻 |
| **单相功率** | P = V × I × cos(φ) | 住宅和商业系统 |
| **三相功率** | P = √3 × V_L × I × cos(φ) | 工业三相系统 |
| **功率因数** | Qc = P(tanφ₁ - tanφ₂) | 功率因数校正 |

### 配电

| 计算 | 公式 | 描述 |
|------|------|------|
| **电压降** | ΔV = 2KIL/S | 验证：照明≤3%，动力≤5% |
| **导线截面** | S = IL/(K×cosφ) | K=56 铜，K=35 铝（30°C） |

### 保护

| 计算 | 公式 | 描述 |
|------|------|------|
| **电磁保护** | I_n = 1.25 × I_c | 断路器按NC 801 |
| **接地** | R ≤ 25Ω | 接地电阻按NC 802 |

---

## 📜 古巴标准

| 标准 | 标题 | 应用 |
|------|------|------|
| **NC 800** | 低压电气安装 | 导体选型、电压降、功率 |
| **NC 801** | 电气安装保护 | 断路器、保护协调 |
| **NC 802** | 接地系统 | 接地电阻 ≤25Ω |
| **NC 803** | 电气照明 | 照明计算 |
| **NC 804** | 电动机 | 电机电路选型 |

---

## 📋 系统要求

- **Node.js**：18.17 或更高
- **npm**：9.x 或更高（或 yarn/pnpm/bun 等效）

---

## 🚀 安装

1. **克隆仓库**

```bash
git clone https://github.com/ogarridojimenez/calculadora-electrica.git
cd calculadora-electrica
```

2. **安装依赖**

```bash
npm install
```

3. **启动开发服务器**

```bash
npm run dev
```

4. **在浏览器中打开**

访问 [http://localhost:3000](http://localhost:3000)

---

## 📖 使用

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 监视模式测试
npm run test:watch

# TypeScript类型检查
npx tsc --noEmit

# 代码检查
npm run lint

# 生产构建
npm run build

# 生产服务器
npm run start
```

### 单元测试

```bash
# 运行所有测试
npm run test

# 运行特定文件
npm run test -- formulas.test.ts

# 带覆盖率的测试
npm run test:coverage
```

---

## 📁 项目结构

```
calculadora-electrica/
├── app/
│   ├── globals.css         # 全局样式和CSS变量
│   ├── layout.tsx          # 根应用布局
│   └── page.tsx            # 主页面
├── components/
│   ├── Calculator.tsx       # 带导航的主组件
│   └── calculations/       # 单独的计算模块
│       ├── CalculoOhm.tsx
│       ├── CalculoPotenciaMonofasica.tsx
│       ├── CalculoPotenciaTrifasica.tsx
│       ├── CalculoCadaTension.tsx
│       ├── CalculoSeccionConductor.tsx
│       ├── CalculoProteccion.tsx
│       ├── CalculoPuestaTierra.tsx
│       └── CalculoFactorPotencia.tsx
├── lib/
│   └── formulas.ts         # 电气计算逻辑
├── __tests__/
│   └── lib/
│       └── formulas.test.ts  # 单元测试
├── jest.config.js          # Jest配置
├── jest.setup.ts           # Jest设置
├── next.config.ts          # Next.js配置
├── tailwind.config.ts      # Tailwind配置
├── tsconfig.json           # TypeScript配置
└── package.json
```

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [Next.js 16.2.0](https://nextjs.org/) | React框架与App Router |
| [React 19](https://react.dev/) | UI库 |
| [TypeScript 5](https://www.typescriptlang.org/) | 静态类型 |
| [Tailwind CSS 4](https://tailwindcss.com/) | CSS框架 |
| [Lucide React](https://lucide.dev/) | 图标库 |
| [Jest](https://jestjs.io/) | 测试框架 |
| [React Testing Library](https://testing-library.com/) | 组件测试 |

---

## 🤝 贡献

欢迎贡献。请先打开一个issue来讨论您想要进行的更改。

1. Fork 仓库
2. 为您的功能创建一个分支（`git checkout -b feature/新功能`）
3. 提交您的更改（`git commit -m '添加新功能'`）
4. 推送到分支（`git push origin feature/新功能`）
5. 打开Pull Request

---

## 📄 许可证

本项目采用MIT许可证 - 有关更多详细信息，请参阅 [LICENSE](LICENSE) 文件。

---

## 👨‍💻 作者

**Osmel Garrido Jiménez**

- GitHub: [@ogarridojimenez](https://github.com/ogarridojimenez)

---

<div align="center">

❤️ 为古巴电气工程师而制作

</div>
