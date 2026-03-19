# CalcEléc - Calculadora Eléctrica Profesional

<div align="center">

![CalcEléc Logo](https://img.shields.io/badge/CalcEléc-Calculadora_Eléctrica-0891b2?style=for-the-badge&logo=electrical&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Herramienta profesional de cálculo eléctrico para Ingenieros Eléctricos cubanos, basada en las normas NC 800, NC 801, NC 802, NC 803 y NC 804.**

[简体中文](./README.zh-CN.md) · [English](./README-en.md)

</div>

---

## Tabla de Contenidos

- [Características](#-características)
- [Cálculos Disponibles](#-cálculos-disponibles)
- [Normas Cubanas Implementadas](#-normas-cubanas-implementadas)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnología](#-tecnología)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

- **8 Calculadoras Especializadas**: Ley de Ohm, Potencia Monofásica/Trifásica, Caída de Tensión, Sección de Conductor, Protección, Puesta a Tierra, Factor de Potencia
- **Validación de Entradas**: Validación robusta de todos los campos de entrada
- **Diseño Responsivo**: Adaptado para escritorio y dispositivos móviles
- **Interface Profesional**: Diseño moderno orientado a ingenieros eléctricos
- **Normas Cubanas**: Implementación fiel de las normas NC eléctricas
- **Código TypeScript**: Tipado estático para mayor seguridad y mantenibilidad
- **Unit Tests**: 27+ pruebas unitarias para funciones de cálculo

---

## 📐 Cálculos Disponibles

### Cálculos Básicos

| Cálculo | Fórmula | Descripción |
|---------|---------|-------------|
| **Ley de Ohm** | V = I × R | Cálculo de Voltaje, Corriente o Resistencia |
| **Potencia Monofásica** | P = V × I × cos(φ) | Sistemas residenciales y comerciales |
| **Potencia Trifásica** | P = √3 × V_L × I × cos(φ) | Sistemas industriales trifásicos |
| **Factor de Potencia** | Qc = P(tanφ₁ - tanφ₂) | Corrección del factor de potencia |

### Distribución

| Cálculo | Fórmula | Descripción |
|---------|---------|-------------|
| **Caída de Tensión** | ΔV = 2KIL/S | Verificación ≤3% iluminación, ≤5% fuerza |
| **Sección de Conductor** | S = IL/(K×cosφ) | K=56 Cu, K=35 Al (30°C) |

### Protección

| Cálculo | Fórmula | Descripción |
|---------|---------|-------------|
| **Protección Magnetotérmica** | I_n = 1.25 × I_c | Interruptores según NC 801 |
| **Puesta a Tierra** | R ≤ 25Ω | Resistencia según NC 802 |

---

## 📜 Normas Cubanas Implementadas

| Norma | Título | Aplicación |
|-------|--------|------------|
| **NC 800** | Instalaciones eléctricas en baja tensión | Dimensionamiento de conductores, caída de tensión, potencia |
| **NC 801** | Protecciones en instalaciones eléctricas | Interruptores magnetotérmicos, coordinación de protecciones |
| **NC 802** | Sistemas de puesta a tierra | Resistencia de puesta a tierra ≤25Ω |
| **NC 803** | Alumbrado eléctrico | Cálculos de iluminación |
| **NC 804** | Motores eléctricos | Dimensionamiento de circuitos de motores |

---

## 📋 Requisitos

- **Node.js**: 18.17 o superior
- **npm**: 9.x o superior (o yarn/pnpm/bun equivalente)

---

## 🚀 Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/ogarridojimenez/calculadora-electrica.git
cd calculadora-electrica
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

4. **Abrir en el navegador**

Visite [http://localhost:3000](http://localhost:3000)

---

## 📖 Uso

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests
npm run test

# Tests en modo watch
npm run test:watch

# Verificación de tipos TypeScript
npx tsc --noEmit

# Linting
npm run lint

# Build de producción
npm run build

# Servidor de producción
npm run start
```

### Tests Unitarios

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar un archivo específico
npm run test -- formulas.test.ts

# Tests con cobertura
npm run test:coverage
```

---

## 📁 Estructura del Proyecto

```
calculadora-electrica/
├── app/
│   ├── globals.css         # Estilos globales y variables CSS
│   ├── layout.tsx          # Layout raíz de la aplicación
│   └── page.tsx            # Página principal
├── components/
│   ├── Calculator.tsx       # Componente principal con navegación
│   └── calculations/       # Módulos de cálculo individuales
│       ├── CalculoOhm.tsx
│       ├── CalculoPotenciaMonofasica.tsx
│       ├── CalculoPotenciaTrifasica.tsx
│       ├── CalculoCadaTension.tsx
│       ├── CalculoSeccionConductor.tsx
│       ├── CalculoProteccion.tsx
│       ├── CalculoPuestaTierra.tsx
│       └── CalculoFactorPotencia.tsx
├── lib/
│   └── formulas.ts         # Lógica de cálculos eléctricos
├── __tests__/
│   └── lib/
│       └── formulas.test.ts  # Pruebas unitarias
├── jest.config.js          # Configuración de Jest
├── jest.setup.ts           # Setup de Jest
├── next.config.ts          # Configuración de Next.js
├── tailwind.config.ts      # Configuración de Tailwind
├── tsconfig.json           # Configuración de TypeScript
└── package.json
```

---

## 🛠️ Tecnología

| Tecnología | Propósito |
|------------|-----------|
| [Next.js 16.2.0](https://nextjs.org/) | Framework React con App Router |
| [React 19](https://react.dev/) | Librería UI |
| [TypeScript 5](https://www.typescriptlang.org/) | Tipado estático |
| [Tailwind CSS 4](https://tailwindcss.com/) | Framework CSS |
| [Lucide React](https://lucide.dev/) | Biblioteca de iconos |
| [Jest](https://jestjs.io/) | Framework de testing |
| [React Testing Library](https://testing-library.com/) | Testing de componentes |

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abra un issue primero para discutir los cambios que desea realizar.

1. Fork el repositorio
2. Cree una rama para su feature (`git checkout -b feature/nueva-funcion`)
3. Commit sus cambios (`git commit -m 'Agregar nueva función'`)
4. Push a la rama (`git push origin feature/nueva-funcion`)
5. Abra un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - vea el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Omar Luis Garrido Jimenez**

- GitHub: [@ogarridojimenez](https://github.com/ogarridojimenez)

---

<div align="center">

Hecho con ❤️ para ingenieros eléctricos cubanos

</div>
