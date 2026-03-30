# AGENTS.md - CalcEléc Electric Calculator

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview

A professional electrical calculator web application for Cuban Electrical Engineers, based on Cuban electrical standards (NC 800, NC 801, NC 802, NC 803, NC 804).

- **Stack**: Next.js 16.2.0, React 19, TypeScript 5, Tailwind CSS 4
- **Language**: Spanish for UI, English for code/comments
- **Icons**: lucide-react
- **Testing**: Jest + React Testing Library

## Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000) - uses webpack on Windows
npm run dev

# Production build
npm run build

# Start production server
npm run start

# TypeScript type checking (without building)
npx tsc --noEmit

# Lint code
npm run lint

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run a single test file
npm run test -- formulas.test.ts
npm run test -- __tests__/lib/formulas.test.ts

# Run tests with coverage
npm run test:coverage
```

## Code Style Guidelines

### TypeScript
- **Strict mode** enabled in tsconfig.json
- **Never use `any`** - use `unknown`, generics, or specific types
- **Prefer inference** for obvious types; annotate for clarity
- **Use `type`** for unions/intersections; **use `interface`** for extensible objects

```typescript
// ✅ Correct
type CalculationMode = 'voltage' | 'current' | 'resistance'
interface CalculationResult { value: number; unit: string }

// ❌ Incorrect
const calc = (data: any): any => { ... }
```

### Naming Conventions
- `camelCase` for variables, functions, methods
- `PascalCase` for React components and interfaces/types
- `UPPER_CASE` for constants
- Spanish for UI labels and user-facing text

### Component Structure
- One component per file
- Named exports (not default), except for `page.tsx` and `layout.tsx`
- Props always typed with interfaces

```typescript
interface ComponentNameProps {
  className?: string
}

export function ComponentName({ className }: ComponentNameProps) {
  return <div className={className}>...</div>
}
```

### Client vs Server Components
- **Default: Server Components**
- Add `'use client'` only when needed (state, effects, events)
- Keep Client Components as low in the tree as possible

### Imports Order
1. Node/built-ins
2. Third-party libraries (`react`, `next`, `lucide-react`)
3. Internal aliases (`@/components`, `@/lib`)
4. Relative imports

```typescript
import { useState } from 'react'
import { Zap, Shield } from 'lucide-react'
import { CalculoOhm } from './calculations/CalculoOhm'
import { calculateOhm } from '@/lib/formulas'
```

### CSS/Tailwind
- Use CSS custom properties from `globals.css` for consistent theming
- Tailwind for utility classes
- No `!important` unless absolutely necessary

```css
/* Use CSS variables */
background: var(--surface-raised);
color: var(--electric-cyan);

/* Tailwind utilities */
<div className="flex items-center gap-3 p-4">
```

## Error Handling

- Always use `try/catch` with specific error handling
- Never leave catch blocks empty
- Show user-friendly messages, log details server-side

```typescript
try {
  const result = calculateOhm(voltage, current)
  setResult(result)
} catch (error) {
  console.error('Calculation error:', error)
  setError('No se pudo calcular. Verifique los valores ingresados.')
}
```

## Formulas and Calculations

All electrical formulas are in `lib/formulas.ts`:

| Formula | Description | Standard |
|---------|-------------|----------|
| Ohm's Law | V = I × R | Basic |
| Single-phase Power | P = V × I × cos(φ) | NC 800 |
| Three-phase Power | P = √3 × V_L × I × cos(φ) | NC 800 |
| Voltage Drop | ΔV = 2KIL/S | NC 800 (≤3% lighting, ≤5% motors) |
| Conductor Sizing | S = IL/(K×cosφ) | NC 800 (K=56 Cu, K=35 Al) |
| Protection | I_n = 1.25 × I_c | NC 801 |
| Grounding | R ≤ 25Ω | NC 802 |
| Power Factor | Qc = P(tanφ1 - tanφ2) | Correction |
| Ilumination | Φ = (E×A)/(η×fm) | NC 803 |
| Motor Current | I_n = P/(√3×V_L×η×cosφ) | NC 804 |
| Short Circuit | Icc = V/(√3×Z) | NC 801 |
| Maximum Demand | D = Σ(P×fd)/fp | NC 800 |
| Conduit Occupancy | %Ocup = ΣAcond/Atubo | NC 800 |

### Constants

All NC constants are centralized in `lib/constants/normas-cubanas.ts`:

- NC_800: CAIDA_TENSION, RESISTIVIDAD, FACTORES_DEMANDA
- NC_801: PROTECCION_THERMAL_FACTOR, PODER_CORTE_STANDARD
- NC_802: RESISTENCIA_TIERRA_MAX, CONDUCTOR_PE rules
- NC_803: TIPOS_LOCALES (iluminancia por tipo de local)
- NC_804: FACTOR_ARRANQUE types

### Types

All TypeScript types are in `types/electrical.ts`:

- Material: 'Cu' | 'Al'
- Sistema: 'monofasico' | 'trifasico'
- TipoArranque: 'directo' | 'estrella-triangulo' | 'variador'
- EstadoCumplimiento: 'cumple' | 'limite' | 'no_cumple'

### Calculation Component Pattern

```typescript
// components/calculations/CalculoXXX.tsx
'use client'

import { useState } from 'react'
import { calculateXXX } from '@/lib/formulas'

export function CalculoXXX() {
  const [inputs, setInputs] = useState({ ... })
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = () => {
    try {
      const res = calculateXXX(inputs)
      setResult(res)
      setError(null)
    } catch (err) {
      setError('Mensaje de error en español')
    }
  }

  return (
    <div>
      {/* Form inputs */}
      {/* Result display */}
      {/* Error message */}
    </div>
  )
}
```

## Responsive Design

This app is designed for both desktop and mobile:

### Breakpoints
- Mobile: < 1024px (lg)
- Desktop: ≥ 1024px (lg)

### Mobile Behavior
- Sidebar hidden by default
- Fixed header with menu button
- Menu opens as overlay
- Menu closes automatically when selecting an option
- Content uses full width with appropriate padding

### Desktop Behavior
- Sidebar visible and collapsible
- Content adjusts to sidebar width
- Full menu stays open when selecting options

## Testing

### Test Location
```
__tests__/
└── lib/
    └── formulas.test.ts
```

### Writing Tests

```typescript
import { calculateOhm } from '@/lib/formulas'

describe('calculateOhm', () => {
  it('should calculate voltage correctly', () => {
    expect(calculateOhm({ current: 2, resistance: 10 })).toBe(20)
  })

  it('should throw error for invalid input', () => {
    expect(() => calculateOhm({ current: -1, resistance: 10 }))
      .toThrow('Error message')
  })
})
```

### Mocking Lucide Icons
Icons are mocked in tests to avoid rendering issues:

```typescript
// jest.setup.ts already includes mocking setup
import '@testing-library/jest-dom'
```

## File Structure

```
calculadora-electrica/
├── app/
│   ├── globals.css           # CSS tokens, Tailwind styles
│   ├── layout.tsx            # Root layout (Spanish metadata)
│   └── page.tsx              # Home page (imports Calculator)
├── components/
│   ├── Calculator.tsx        # Main component with sidebar
│   ├── ThemeProvider.tsx    # Dark/light mode context
│   ├── ToastProvider.tsx     # Toast notifications
│   ├── HistoryProvider.tsx   # History state management
│   ├── HistoryPanel.tsx     # History panel UI
│   ├── PWAUpdater.tsx       # Service worker registration
│   └── calculations/         # Individual calculation modules
│       ├── CalculoOhm.tsx
│       ├── CalculoPotenciaMonofasica.tsx
│       ├── CalculoPotenciaTrifasica.tsx
│       ├── CalculoCadaTension.tsx
│       ├── CalculoSeccionConductor.tsx
│       ├── CalculoProteccion.tsx
│       ├── CalculoPuestaTierra.tsx
│       ├── CalculoFactorPotencia.tsx
│       ├── CalculoIluminacion.tsx     # NC 803
│       ├── CalculoMotor.tsx            # NC 804
│       ├── CalculoCortocircuito.tsx   # NC 801
│       ├── CalculoDemanda.tsx         # NC 800
│       └── CalculoCanalizacion.tsx     # NC 800
├── lib/
│   ├── formulas.ts           # Core calculation logic
│   ├── pdfExport.tsx        # PDF export
│   └── constants/
│       └── normas-cubanas.ts # NC constants
├── types/
│   └── electrical.ts         # TypeScript types
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker for offline support
│   └── icons/                # PWA icons (192x192, 512x512)
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI/CD
├── __tests__/
│   └── lib/
│       └── formulas.test.ts
├── jest.config.js
├── jest.setup.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json              # Security headers
└── package.json
```

## Calculation Modules

| Module | File | Norma | Description |
|--------|------|-------|-------------|
| Ley de Ohm | CalculoOhm.tsx | - | V, I, R |
| Potencia Monofásica | CalculoPotenciaMonofasica.tsx | NC 800 | P = V × I × cos(φ) |
| Potencia Trifásica | CalculoPotenciaTrifasica.tsx | NC 800 | P = √3 × V_L × I × cos(φ) |
| Caída de Tensión | CalculoCadaTension.tsx | NC 800 | ΔV ≤ 3%/5% |
| Sección Conductor | CalculoSeccionConductor.tsx | NC 800 | S = I/K |
| Protección | CalculoProteccion.tsx | NC 801 | I_n = 1.25 × I_c |
| Puesta a Tierra | CalculoPuestaTierra.tsx | NC 802 | R ≤ 25Ω |
| Factor Potencia | CalculoFactorPotencia.tsx | - | Qc = P(tanφ1 - tanφ2) |
| Iluminación | CalculoIluminacion.tsx | NC 803 | Φ, N luminarias, k |
| Motor | CalculoMotor.tsx | NC 804 | I_n, I_arr, protección |
| Cortocircuito | CalculoCortocircuito.tsx | NC 801 | Icc 3φ/1φ |
| Demanda | CalculoDemanda.tsx | NC 800 | D_max, acometida |
| Canalización | CalculoCanalizacion.tsx | NC 800 | % ocupación tubo |

## What to Avoid

- **Never use `any`** in TypeScript
- **Never commit secrets** or API keys
- **Never use `console.log`** in production
- **Never ignore errors** with empty catch blocks
- **Don't mix business logic** inside components (extract to `lib/`)
- **Don't use Pages Router** - always App Router
- **Don't hardcode URLs** or configurations - use environment variables

## Before Making Changes

1. Read relevant files to understand context
2. Explain the plan briefly before writing code
3. Run `npm run build` to verify no errors before committing
4. Run `npm run test` to ensure tests pass

---

# Mejoras Pendientes del Proyecto

## Phase 1 ✅ (Completada)
- Dashboard stats con personalidad
- ResultCard component
- Iconos únicos por cálculo
- Indicador activo en sidebar colapsado

## Phase 2 ⚠️ (Parcialmente completada)
| Tarea | Estado |
|-------|--------|
| Tipografía (Inter + JetBrains Mono) | ✅ Completado |
| Sistema de elevación (backdrop blur, sombras) | ✅ Completado |
| Micro-interacciones | ✅ Completado |
| Skeleton loading | ✅ Completado |
| Input con labels flotantes | ❌ Problemas - revertido a inputs simples |

## Phase 3 - Pendiente

### 3.1 Estados de Controles
- [ ] Estados hover para todos los botones e inputs
- [ ] Estados focus visibles y accesibles
- [ ] Estados disabled para elementos no interactivos
- [ ] Estados loading para datos que se cargan
- [ ] Estados error para validaciones fallidas

### 3.2 Consistency Checks
- [ ] Verificar spacing en el grid definido
- [ ] Verificar depth usando la estrategia declarada
- [ ] Verificar colores de la paleta definida
- [ ] Verificar patrones documentados reutilizados

### 3.3 Animaciones y Micro-interacciones
- [ ] Transiciones suaves en hover/focus
- [ ] Easing deceleration para animaciones
- [ ] Feedback visual al hacer click
- [ ] Animaciones de entrada/salida para modals

## Phase 4 - Pendiente

### 4.1 Revisión de Jerarquía Visual
- [ ] Squint test - verificar que jerarquía se percibe sin detalles
- [ ] Verificar que nada "salta" agresivamente
- [ ] borders/separadores suaves

### 4.2 Sistema de Diseño
- [ ] Documentar tokens de colores
- [ ] Documentar escala de spacing
- [ ] Documentar escala de border-radius
- [ ] Documentar profundidades (shadows/borders)

### 4.3 Componentes Avanzados
- [ ] Dropdowns personalizados (no native select)
- [ ] Date pickers personalizados
- [ ] Modal/Dialog component
- [ ] Tooltips

## Phase 5 - Pendiente

### 5.1 Accesibilidad
- [ ] Verificar contraste de colores
- [ ] Navegación por teclado
- [ ] ARIA labels donde sea necesario
- [ ] Focus indicators visibles

### 5.2 Performance
- [ ] Optimizar carga de fonts
- [ ] Code splitting donde sea necesario
- [ ] Lazy loading para componentes pesados

### 5.3 Testing Visual
- [ ] Snapshot tests para componentes
- [ ] Tests de regresión visual

## Notas Técnicas

### Input Component
El componente Input.tsx fue revertido a versión simple debido a problemas con labels flotantes. La versión actual usa labels tradicionales encima del campo.

### Build
El build está configurado para usar webpack (`next build` sin Turbopack) para evitar errores en Windows.

### To-do futuro
- Implementar labels flotantes correctamente cuando se tenga tiempo
- Crear archivo `.interface-design/system.md` para documentar decisiones de diseño
- Realizar audit completo con `/interface-design:audit`
