# CalcEléc - Professional Electrical Calculator

<div align="center">

![CalcEléc Logo](https://img.shields.io/badge/CalcEléc-Electrical_Calculator-0891b2?style=for-the-badge&logo=electrical&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Professional electrical calculation tool for Cuban Electrical Engineers, based on Cuban standards NC 800, NC 801, NC 802, NC 803, and NC 804.**

[简体中文](./README.zh-CN.md) · [Español](./README.md)

</div>

---

## Table of Contents

- [Features](#-features)
- [Available Calculations](#-available-calculations)
- [Cuban Standards Implemented](#-cuban-standards-implemented)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Technology](#-technology)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **8 Specialized Calculators**: Ohm's Law, Single/Three-phase Power, Voltage Drop, Conductor Section, Protection, Grounding, Power Factor
- **Input Validation**: Robust validation for all input fields
- **Responsive Design**: Adapted for desktop and mobile devices
- **Professional Interface**: Modern design oriented to electrical engineers
- **Cuban Standards**: Faithful implementation of Cuban electrical NC standards
- **TypeScript Code**: Static typing for better safety and maintainability
- **Unit Tests**: 27+ unit tests for calculation functions

---

## 📐 Available Calculations

### Basic Calculations

| Calculation | Formula | Description |
|-------------|---------|-------------|
| **Ohm's Law** | V = I × R | Calculate Voltage, Current or Resistance |
| **Single-phase Power** | P = V × I × cos(φ) | Residential and commercial systems |
| **Three-phase Power** | P = √3 × V_L × I × cos(φ) | Industrial three-phase systems |
| **Power Factor** | Qc = P(tanφ₁ - tanφ₂) | Power factor correction |

### Distribution

| Calculation | Formula | Description |
|-------------|---------|-------------|
| **Voltage Drop** | ΔV = 2KIL/S | Verification ≤3% lighting, ≤5% force |
| **Conductor Section** | S = IL/(K×cosφ) | K=56 Cu, K=35 Al (30°C) |

### Protection

| Calculation | Formula | Description |
|-------------|---------|-------------|
| **Magnetothermic Protection** | I_n = 1.25 × I_c | Circuit breakers per NC 801 |
| **Grounding** | R ≤ 25Ω | Grounding resistance per NC 802 |

---

## 📜 Cuban Standards Implemented

| Standard | Title | Application |
|----------|-------|-------------|
| **NC 800** | Low voltage electrical installations | Conductor sizing, voltage drop, power |
| **NC 801** | Electrical installations protections | Circuit breakers, protection coordination |
| **NC 802** | Grounding systems | Grounding resistance ≤25Ω |
| **NC 803** | Electrical lighting | Lighting calculations |
| **NC 804** | Electric motors | Motor circuit sizing |

---

## 📋 Requirements

- **Node.js**: 18.17 or higher
- **npm**: 9.x or higher (or yarn/pnpm/bun equivalent)

---

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/ogarridojimenez/calculadora-electrica.git
cd calculadora-electrica
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open in browser**

Visit [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage

### Local Development

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Tests in watch mode
npm run test:watch

# TypeScript type checking
npx tsc --noEmit

# Linting
npm run lint

# Production build
npm run build

# Production server
npm run start
```

### Unit Tests

```bash
# Run all tests
npm run test

# Run specific file
npm run test -- formulas.test.ts

# Tests with coverage
npm run test:coverage
```

---

## 📁 Project Structure

```
calculadora-electrica/
├── app/
│   ├── globals.css         # Global styles and CSS variables
│   ├── layout.tsx          # Root application layout
│   └── page.tsx            # Main page
├── components/
│   ├── Calculator.tsx       # Main component with navigation
│   └── calculations/       # Individual calculation modules
│       ├── CalculoOhm.tsx
│       ├── CalculoPotenciaMonofasica.tsx
│       ├── CalculoPotenciaTrifasica.tsx
│       ├── CalculoCadaTension.tsx
│       ├── CalculoSeccionConductor.tsx
│       ├── CalculoProteccion.tsx
│       ├── CalculoPuestaTierra.tsx
│       └── CalculoFactorPotencia.tsx
├── lib/
│   └── formulas.ts         # Electrical calculation logic
├── __tests__/
│   └── lib/
│       └── formulas.test.ts  # Unit tests
├── jest.config.js          # Jest configuration
├── jest.setup.ts           # Jest setup
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

---

## 🛠️ Technology

| Technology | Purpose |
|------------|---------|
| [Next.js 16.2.0](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [TypeScript 5](https://www.typescriptlang.org/) | Static typing |
| [Tailwind CSS 4](https://tailwindcss.com/) | CSS framework |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Jest](https://jestjs.io/) | Testing framework |
| [React Testing Library](https://testing-library.com/) | Component testing |

---

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss the changes you would like to make.

1. Fork the repository
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License

This project is under the MIT License - see the [LICENSE](LICENSE) file for more details.

---

## 👨‍💻 Author

**Osmel Garrido Jiménez**

- GitHub: [@ogarridojimenez](https://github.com/ogarridojimenez)

---

<div align="center">

Made with ❤️ for Cuban electrical engineers

</div>
