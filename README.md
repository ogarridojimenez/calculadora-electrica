# CalcEléc - Calculadora Eléctrica Profesional

<div align="center">

![CalcEléc logo](https://img.shields.io/badge/CalcEléc-Calculadora_Eléctrica-0891b2?style=for-the-badge&logo=electrical&logoColor=white)
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

- **14 Calculadoras Especializadas** - La suite más completa de cálculo eléctrico
- **Validación de Entradas** - Validación robusta de todos los campos de entrada
- **Diseño Responsivo** - Adaptado para escritorio y dispositivos móviles
- **PWA (Progressive Web App)** - Instálala en tu móvil como app nativa
- **Modo Oscuro** - Tema claro/oscuro con persistencia
- **Interface Profesional** - Diseño moderno orientado a ingenieros eléctricos
- **Notificaciones Toast** - Feedback visual de cálculos realizados
- **Historial** - Guarda y exporta cálculos en PDF con nombre personalizado
- **Normas Cubanas** - Implementación fiel de las normas NC eléctricas
- **Factores de Corrección** - Temperatura y agrupación de conductores
- **Indicadores de Cumplimiento** - Visualización clara de cumplimiento normativo
- **Código TypeScript** - Tipado estático para mayor seguridad y mantenibilidad
- **Unit Tests** - 27+ pruebas unitarias para funciones de cálculo
- **CI/CD** - GitHub Actions para integración continua
- **Security Headers** - Headers HTTP de seguridad configurados
- **TypeScript Estricto** - Sin `any`, sin `@ts-ignore`

---

## 📐 Cálculos Disponibles

### Cálculos Básicos

| Cálculo | Fórmula | Descripción | Norma |
|---------|---------|-------------|-------|
| **Ley de Ohm** | V = I × R | Cálculo de Voltaje, Corriente o Resistencia | - |
| **Potencia Monofásica** | P = V × I × cos(φ) | Sistemas residenciales y comerciales | NC 800 |
| **Potencia Trifásica** | P = √3 × V_L × I × cos(φ) | Sistemas industriales trifásicos | NC 800 |
| **Factor de Potencia** | Qc = P(tanφ₁ - tanφ₂) | Corrección del factor de potencia | - |
| **Motor Eléctrico** | I_n = P/(√3×V_L×η×cosφ) | Corriente nominal, arranque, protección | NC 804 |

### Distribución

| Cálculo | Fórmula | Descripción | Norma |
|---------|---------|-------------|-------|
| **Caída de Tensión** | ΔV = 2KIL/S | Verificación ≤3% iluminación, ≤5% fuerza | NC 800 |
| **Sección de Conductor** | S = IL/(K×cosφ) | K=56 Cu, K=35 Al (30°C) | NC 800 |
| **Iluminación** | Φ = (E×A)/(η×fm) | Flujo luminoso, número de luminarias | NC 803 |
| **Demanda Máxima** | D = Σ(P×fd)/fp | Método detallado y residencial simplificado | NC 800 |
| **Canalización** | %Ocup = ΣAcond/Atubo | Verificación de ocupación de tubos | NC 800 |

### Protección

| Cálculo | Fórmula | Descripción | Norma |
|---------|---------|-------------|-------|
| **Protección Magnetotérmica** | I_n = 1.25 × I_c | Interruptores según NC 801 | NC 801 |
| **Puesta a Tierra** | R ≤ 25Ω | Resistencia según NC 802 | NC 802 |
| **Cortocircuito** | Icc = V/(√3×Z) | Icc trifásico/monofásico, poder de corte | NC 801 |

---

## 📜 Normas Cubanas Implementadas

| Norma | Título | Aplicación |
|-------|--------|------------|
| **NC 800** | Instalaciones eléctricas en baja tensión | Dimensionamiento de conductores, caída de tensión, potencia, demanda |
| **NC 801** | Protecciones en instalaciones eléctricas | Interruptores magnetotérmicos, cortocircuito |
| **NC 802** | Sistemas de puesta a tierra | Resistencia de puesta a tierra ≤25Ω |
| **NC 803** | Alumbrado eléctrico | Cálculos de iluminación de interiores |
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
│   ├── globals.css           # Estilos globales y variables CSS
│   ├── layout.tsx            # Layout raíz de la aplicación
│   └── page.tsx              # Página principal
├── components/
│   ├── Calculator.tsx        # Componente principal con navegación
│   ├── ThemeProvider.tsx    # Proveedor de tema oscuro
│   ├── ToastProvider.tsx     # Proveedor de notificaciones
│   ├── HistoryProvider.tsx   # Proveedor de historial
│   ├── HistoryPanel.tsx     # Panel de historial
│   ├── PWAUpdater.tsx        # Registro de service worker
│   └── calculations/         # Módulos de cálculo individuales
│       ├── CalculoOhm.tsx
│       ├── CalculoPotenciaMonofasica.tsx
│       ├── CalculoPotenciaTrifasica.tsx
│       ├── CalculoCadaTension.tsx
│       ├── CalculoSeccionConductor.tsx
│       ├── CalculoProteccion.tsx
│       ├── CalculoPuestaTierra.tsx
│       ├── CalculoFactorPotencia.tsx
│       ├── CalculoIluminacion.tsx    # NC 803
│       ├── CalculoMotor.tsx           # NC 804
│       ├── CalculoCortocircuito.tsx    # NC 801
│       ├── CalculoDemanda.tsx          # NC 800
│       └── CalculoCanalizacion.tsx    # NC 800
├── lib/
│   ├── formulas.ts           # Lógica de cálculos eléctricos
│   ├── pdfExport.tsx         # Exportación a PDF
│   └── constants/
│       └── normas-cubanas.ts  # Constantes normativas
├── types/
│   └── electrical.ts          # Tipos TypeScript
├── public/
│   ├── manifest.json         # Manifiesto PWA
│   ├── sw.js                 # Service worker
│   └── icons/                # Iconos PWA
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI/CD
├── __tests__/
│   └── lib/
│       └── formulas.test.ts  # Pruebas unitarias
├── jest.config.js
├── jest.setup.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
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
| [jsPDF](https://jspdf.github.io/) | Generación de PDFs |

---

## 📊 Resumen de Funcionalidades

### Módulos de Cálculo (14 total)

1. **Ley de Ohm** - V, I, R
2. **Potencia Monofásica** - P = V × I × cos(φ)
3. **Potencia Trifásica** - P = √3 × V_L × I × cos(φ)
4. **Caída de Tensión** - Verificación normativa NC 800
5. **Sección de Conductor** - Dimensionamiento K=56/35
6. **Protección Magnetotérmica** - Interruptores NC 801
7. **Puesta a Tierra** - R ≤ 25Ω NC 802
8. **Factor de Potencia** - Banco de capacitores
9. **Iluminación (NC 803)** - Flujo, luminarias, índice local
10. **Motor Eléctrico (NC 804)** - Nominal, arranque, protección
11. **Cortocircuito (NC 801)** - Icc trifásico/monofásico
12. **Demanda Máxima (NC 800)** - Método detallado y residencial
13. **Canalización (NC 800)** - Ocupación de tubos

### Características Técnicas

- Constantes normativas centralizadas en `/lib/constants/`
- Tipos TypeScript especializados en `/types/`
- Factores de corrección (temperatura, agrupación)
- Secciones normalizadas cubanas
- Tablas de iluminación por tipo de local

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
