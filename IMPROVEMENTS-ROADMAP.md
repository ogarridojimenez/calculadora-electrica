# 📋 ROADMAP DE MEJORAS - CalcEléc

Documento de referencia para mejoras futuras del proyecto. Generado: Abril 3, 2026

---

## 📌 TABLA DE CONTENIDOS

1. [Mejoras Críticas (P0)](#p0---crítico)
2. [Mejoras Alta Prioridad (P1)](#p1---alta-prioridad)
3. [Mejoras Media Prioridad (P2)](#p2---media-prioridad)
4. [Mejoras Baja Prioridad (P3)](#p3---baja-prioridad)
5. [Mejoras Futuro (P4)](#p4---futuro)
6. [Resumen General](#-resumen-de-esfuerzo)
7. [Roadmap Recomendado](#-roadmap-recomendado-6-12-meses)
8. [Quick Wins](#-quick-wins-para-empezar-hoy)

---

## 🔴 P0 - CRÍTICO

### 1. Arreglar Hydration Mismatch en Clock Component

**Estado**: ✅ COMPLETADO (Abril 3, 2026)  
**Impacto**: `npm run dev` falla → ✅ RESUELTO  
**Esfuerzo**: 5 minutos  
**Prioridad**: AHORA

**Descripción**:
El componente Clock en Calculator.tsx tiene un mismatch entre el render del servidor y cliente. El badge de historial se renderiza condicionalmente basado en `history.length`, lo que causa que el servidor y cliente generen HTML diferente.

**Localización**: `components/Calculator.tsx` líneas 579-584

**Problema**:
```typescript
<button>
  <Clock size={24} />
  {history.length > 0 && (           // ← Mismatch aquí
    <span className="absolute -top-1 -right-1 w-5 h-5 rounded...">
      {history.length > 9 ? '9+' : history.length}
    </span>
  )}
</button>
```

**Solución**:
```typescript
<button suppressHydrationWarning>    // ← Agregar esto
  <Clock size={24} />
  {history.length > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5 rounded...">
      {history.length > 9 ? '9+' : history.length}
    </span>
  )}
</button>
```

**O alternativa con useEffect**:
```typescript
'use client'
import { useState, useEffect } from 'react'

export function Calculator() {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  return (
    <button>
      <Clock size={24} />
      {isMounted && history.length > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded...">
          {history.length > 9 ? '9+' : history.length}
        </span>
      )}
    </button>
  )
}
```

**Testing**:
```bash
npm run dev
# Verificar que no hay errores de hydration en la consola del navegador
```

---

## 🟢 P1 - ALTA PRIORIDAD

### 2. Exportación PDF Mejorada

**Estado**: 🟡 Parcialmente implementado (existe `pdfExport.tsx` básico)  
**Esfuerzo**: 8-12 horas  
**ROI**: ⭐⭐⭐⭐⭐ (Diferenciador profesional)  
**Tech Stack**: `pdfkit`, `exceljs`, `qrcode.react`, `jspdf-autotable` (ya existe)

**Descripción**:
Mejorar la exportación actual de PDF con características profesionales:

**Mejoras**:
- [ ] Agregar QR code con enlace al cálculo guardado
- [ ] Incluir normas cubanas referenciadas (NC 800-804, IEC 60364-5-52)
- [ ] Firma digital para ingenieros (con certificado)
- [ ] Formato profesional con logo/membrete de empresa
- [ ] Encabezado y pie de página personalizables
- [ ] Exportar a múltiples formatos:
  - [x] PDF (existe)
  - [ ] Excel (.xlsx)
  - [ ] JSON (para sincronizar con servidor)
  - [ ] CSV (para análisis)
- [ ] Historial de exportaciones

**Capas de implementación**:

**Fase 1 (2-3h)**: Mejorar PDF actual
```typescript
// lib/pdfExport.tsx
// Agregar:
// - Encabezado con logo
// - Pie de página con fecha/hora
// - Tabla de normas aplicadas
// - Metadata del PDF (autor, asunto, keywords)
```

**Fase 2 (3-4h)**: Agregar QR y firma
```typescript
// npm install qrcode.react
// Generar QR con URL: https://calcelec.app/calc/{id}
// Campo de firma digital del ingeniero
```

**Fase 3 (3-5h)**: Excel y otros formatos
```typescript
// npm install exceljs
// Exportar datos en formato tabular
// Gráficos de resultados en Excel
```

**Archivos a crear/modificar**:
- `lib/pdfExport.ts` - Función mejorada
- `lib/excelExport.ts` - Nueva función para Excel
- `lib/jsonExport.ts` - Nueva función para JSON
- `components/ExportModal.tsx` - Nuevo modal de opciones
- `types/electrical.ts` - Agregar tipos de exportación

---

### 3. Compartir Cálculos por URL

**Estado**: 🔴 No implementado  
**Esfuerzo**: 6-10 horas  
**ROI**: ⭐⭐⭐⭐ (Colaboración profesional)  
**Tech Stack**: Supabase (PostgreSQL) + Next.js API Routes + Next.js URL shortener

**Descripción**:
Guardar cálculos en base de datos y generar URLs compartibles para colaboración entre ingenieros.

**Funcionalidad**:
- [ ] Guardar cálculo en base de datos con `user_id`
- [ ] Generar URL corta única (ej: `calcelec.app/c/abc123`)
- [ ] Compartir por email/WhatsApp/copy-link
- [ ] Ver cálculo compartido (read-only o editable)
- [ ] Permisos de acceso (público, privado, compartido)
- [ ] Auditoría de quién accedió a qué

**Base de datos**:
```sql
-- tabla: shared_calculations
CREATE TABLE shared_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  calculation_name TEXT NOT NULL,
  calculation_type VARCHAR(50),
  inputs JSONB,
  results JSONB,
  short_url VARCHAR(10) UNIQUE,
  is_public BOOLEAN DEFAULT false,
  access_level VARCHAR(20) DEFAULT 'view', -- 'view', 'edit', 'admin'
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  shared_with VARCHAR[] DEFAULT '{}' -- array de emails
);

-- tabla: calculation_access_log
CREATE TABLE calculation_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id UUID REFERENCES shared_calculations,
  accessed_by VARCHAR(255),
  accessed_at TIMESTAMP DEFAULT now(),
  action VARCHAR(20) -- 'view', 'edit', 'export'
);
```

**API Routes**:
```
POST   /api/calculations/share     → Crear URL compartible
GET    /api/calculations/:id        → Obtener cálculo
PUT    /api/calculations/:id        → Actualizar (si tiene permisos)
POST   /api/calculations/:id/access → Log de acceso
GET    /api/short/:shortUrl        → Redirigir a cálculo completo
```

**Archivos a crear/modificar**:
- `lib/supabase.ts` - Cliente de Supabase
- `app/api/calculations/share/route.ts` - Nuevo endpoint
- `app/api/calculations/[id]/route.ts` - Nuevo endpoint
- `app/api/short/[shortUrl]/route.ts` - Nuevo endpoint
- `components/ShareModal.tsx` - Nuevo modal
- `lib/urlShortener.ts` - Generador de URLs cortas

**Setup Supabase**:
```bash
# 1. Crear cuenta en supabase.com
# 2. Crear proyecto
# 3. Agregar variables de entorno
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# 4. Ejecutar SQL arriba
# 5. Configurar RLS (Row Level Security)
```

---

### 4. Dashboard de Estadísticas

**Estado**: 🔴 No implementado  
**Esfuerzo**: 10-14 horas  
**ROI**: ⭐⭐⭐ (Productividad/Analytics)  
**Tech Stack**: `recharts` (gráficos) + localStorage/Supabase

**Descripción**:
Dashboard visual con estadísticas de uso de la calculadora.

**Métricas**:
- [ ] Cálculos más usados (top 5)
- [ ] Tendencias de uso (últimos 7/30 días)
- [ ] Proyectos recientes
- [ ] Normas más consultadas
- [ ] Tiempo promedio por cálculo
- [ ] Tasa de error (validación fallidas)
- [ ] Instalaciones PWA

**Componentes**:
- `components/Dashboard.tsx` - Layout principal
- `components/charts/CalculationsTrendChart.tsx` - Gráfico de tendencias
- `components/charts/TopCalculationsChart.tsx` - Top 5 cálculos
- `components/cards/StatsCard.tsx` - Tarjetas de estadísticas
- `lib/analytics.ts` - Funciones de análisis

**Datos**:
```typescript
// Guardar en localStorage
interface CalculationLog {
  id: string
  type: string // 'ohm', 'potencia_monofasica', etc
  inputs: Record<string, any>
  duration: number // ms
  timestamp: number
  success: boolean
  errorMessage?: string
}

// localStorage key: 'calculations_log'
```

**Visualizaciones**:
- Gráfico de línea: Cálculos por día
- Gráfico de torta: Distribución por tipo
- Gráfico de barras: Normas más usadas
- Cards: Total cálculos, hoy, esta semana
- Tabla: Últimos 10 cálculos

---

### 5. Búsqueda y Filtrado de Cálculos

**Estado**: 🟡 Historial básico existe, pero sin búsqueda  
**Esfuerzo**: 6-8 horas  
**ROI**: ⭐⭐⭐⭐ (UX mejorada)  
**Tech Stack**: `cmdk` (command palette) + fuzzy search

**Descripción**:
Mejorar el acceso a cálculos con búsqueda rápida y filtrado avanzado.

**Funcionalidad**:
- [ ] Abierto con Cmd/Ctrl+K (command palette style)
- [ ] Búsqueda fuzzy por nombre de cálculo
- [ ] Filtrado por:
  - [ ] Fecha (últimos 7 días, mes, año, custom)
  - [ ] Tipo de cálculo
  - [ ] Norma aplicada (NC 800, 801, 802, etc)
  - [ ] Estado (exitoso, error)
- [ ] Marcador de favoritos (⭐)
- [ ] Borrar/Archivar cálculos
- [ ] Mostrar atajos de teclado

**Instalación**:
```bash
npm install cmdk
```

**Componentes**:
- `components/CalculationCommandPalette.tsx` - Command palette
- `components/HistoryPanel.tsx` - Mejorar existente con filtros
- `lib/searchUtils.ts` - Funciones de búsqueda

**Esquema de búsqueda**:
```typescript
interface SearchableCalculation {
  id: string
  name: string
  type: string
  normas: string[] // ['NC 800', 'NC 801']
  date: number
  isFavorite: boolean
  inputs: Record<string, any>
  results: Record<string, any>
}
```

---

## 🟡 P2 - MEDIA PRIORIDAD

### 6. API REST Completa

**Estado**: 🔴 No implementado  
**Esfuerzo**: 10-12 horas  
**ROI**: ⭐⭐⭐⭐ (Integración externa/Microservicios)  
**Tech Stack**: Next.js Route Handlers + Zod + Supabase

**Descripción**:
Crear API REST profesional para integración con terceros y automatización.

**Endpoints**:

```
POST   /api/v1/calculations              → Crear cálculo
GET    /api/v1/calculations              → Listar cálculos del usuario
GET    /api/v1/calculations/:id          → Obtener cálculo específico
PUT    /api/v1/calculations/:id          → Actualizar cálculo
DELETE /api/v1/calculations/:id          → Eliminar cálculo
GET    /api/v1/calculations/export/pdf   → Descargar PDF
POST   /api/v1/calculations/batch        → Procesar lote de cálculos
GET    /api/v1/formulas/:type            → Obtener fórmula documentada
GET    /api/v1/normas                    → Listar normas disponibles
GET    /api/v1/health                    → Health check
```

**Autenticación**:
- [ ] API Keys para clientes
- [ ] JWT para usuarios autenticados
- [ ] Rate limiting (100 req/min por IP)
- [ ] CORS configurado

**Validación**:
```typescript
// lib/validations/api.ts
import { z } from 'zod'

export const createCalculationSchema = z.object({
  type: z.enum(['ohm', 'potencia_monofasica', 'potencia_trifasica', /* ... */]),
  inputs: z.record(z.unknown()),
  name: z.string().min(3).max(100).optional(),
})

export const batchCalculationSchema = z.object({
  calculations: z.array(createCalculationSchema).max(100),
})
```

**Respuestas**:
```typescript
// Exitosa (200)
{
  success: true,
  data: {
    id: "uuid",
    type: "ohm",
    inputs: { /* ... */ },
    results: { /* ... */ },
    createdAt: "2026-04-03T10:30:00Z"
  }
}

// Error (400/500)
{
  success: false,
  error: {
    code: "INVALID_INPUT",
    message: "Campo 'voltage' es requerido",
    details: { /* ... */ }
  }
}
```

**Archivos a crear**:
- `app/api/v1/calculations/route.ts`
- `app/api/v1/calculations/[id]/route.ts`
- `app/api/v1/calculations/batch/route.ts`
- `app/api/v1/formulas/[type]/route.ts`
- `lib/validations/api.ts`
- `lib/api-errors.ts` - Manejo de errores
- `middleware.ts` - Rate limiting y auth

---

### 7. Modo Offline Mejorado

**Estado**: ✅ PWA básico existe ([sw.js](public/sw.js))  
**Esfuerzo**: 8-10 horas  
**ROI**: ⭐⭐⭐ (Confiabilidad en campo)  
**Tech Stack**: Service Workers avanzados + Background Sync API

**Descripción**:
Mejorar el soporte offline actual con sincronización bidireccional y better UX.

**Mejoras**:
- [ ] Sincronización de cálculos when online
- [ ] Indicador visual de estado (online/offline)
- [ ] Cola de cálculos pendientes
- [ ] Notificaciones cuando se reconecta (Push API)
- [ ] Persistencia en IndexedDB (no solo localStorage)
- [ ] Background Sync (sincronizar al conectar)
- [ ] Conflict resolution si hay cambios en ambos lados
- [ ] Historial offline local que syncea

**Actualizar service worker**:
```typescript
// public/sw.js - Mejorar existente
// Agregar:
// - Background Sync para cálculos guardados
// - Push notifications
// - Dynamic caching estrategy
// - Precache de assets críticos
```

**Componentes**:
- `components/OfflineIndicator.tsx` - Badge online/offline
- `lib/offlineStorage.ts` - Manejo de IndexedDB
- `lib/backgroundSync.ts` - Sincronización en background

**IndexedDB Schema**:
```typescript
// DB name: 'CalcElec'
// Object stores:
const stores = {
  calculations: {
    keyPath: 'id',
    indexes: ['timestamp', 'type', 'synced']
  },
  pendingSync: {
    keyPath: 'id',
    indexes: ['calculationId', 'action']
  },
  syncConflicts: {
    keyPath: 'id',
    indexes: ['calculationId', 'resolvedAt']
  }
}
```

---

### 8. Validación en Tiempo Real

**Estado**: 🟡 Validación básica existe  
**Esfuerzo**: 6-8 horas  
**ROI**: ⭐⭐⭐ (UX/Prevención de errores)  
**Tech Stack**: React Hook Form + zod + validaciones custom

**Descripción**:
Mejorar validación mientras escriben, con sugerencias inteligentes.

**Mejoras**:
- [ ] Validación instantánea (debounced) mientras escriben
- [ ] Mensajes de error específicos y útiles
- [ ] Sugerencias: "¿Quisiste decir 3 fases?" cuando detecta error
- [ ] Advertencias por rango: "Valor muy alto para corriente"
- [ ] Auto-corrección: Suggestions dropdown
- [ ] Cálculos de valores derivados automáticos
- [ ] Tooltips con rangos válidos según norma

**Componentes**:
- `components/Input.tsx` - Mejorar existente
- `components/ValidationMessage.tsx` - Nuevo
- `lib/validation/rules.ts` - Reglas de validación
- `lib/validation/suggestions.ts` - Generador de sugerencias

**Ejemplo de validación avanzada**:
```typescript
// lib/validation/rules.ts
export const validationRules = {
  voltage: {
    min: 0,
    max: 480,
    unit: 'V',
    warningRange: [120, 480],
    suggestions: (value: number) => {
      if (value > 480) return "¿Quizás alta tensión?"
      if (value === 220.8) return "¿220V monofásico?"
      if (value === 380) return "¿380V trifásico?"
    }
  },
  current: {
    min: 0.1,
    max: 1000,
    unit: 'A',
    warningRange: [100, 800],
  },
  // ... más reglas
}
```

---

### 9. Multi-Idioma

**Estado**: 🔴 No implementado (solo española)  
**Esfuerzo**: 12-16 horas  
**ROI**: ⭐⭐⭐⭐ (Mercado regional)  
**Tech Stack**: `next-intl` o `i18next`

**Descripción**:
Soporte para múltiples idiomas: Español (actual), Inglés, Portugués.

**Idiomas soportados**:
- [x] Español (es)
- [ ] English (en)
- [ ] Português (pt-BR)

**Estrategia**:
- Código en inglés (ya está así)
- UI/mensajes en múltiples idiomas
- Rutas por idioma: `/es/`, `/en/`, `/pt/`
- Selector de idioma en UI
- Guardar preferencia en localStorage

**Instalación**:
```bash
npm install next-intl
```

**Estructura**:
```
messages/
├── es.json
├── en.json
└── pt-BR.json

app/
├── [locale]/
│   ├── page.tsx
│   └── ...
└── middleware.ts
```

**Archivos a crear/modificar**:
- `messages/es.json` - Mensajes español (extraer de componentes)
- `messages/en.json` - Mensajes inglés
- `messages/pt-BR.json` - Mensajes portugués
- `middleware.ts` - Routing por idioma
- `lib/i18n.ts` - Setup de i18n
- `app/[locale]/layout.tsx` - Root layout con idioma

**Contenido a traducir**:
- Labels de inputs
- Nombres de cálculos
- Descripciones
- Mensajes de error
- Botones
- Sidebar
- Tooltips

---

## 🔵 P3 - BAJA PRIORIDAD

### 10. CI/CD Completo

**Estado**: 🟡 GitHub Actions básico existe  
**Esfuerzo**: 8-10 horas  
**ROI**: ⭐⭐⭐ (Calidad de código)  
**Tech Stack**: GitHub Actions + Playwright + Lighthouse

**Descripción**:
Expandir CI/CD actual con más validaciones y reportes.

**Mejoras**:
- [ ] E2E tests automáticos (Playwright - ya existe config)
- [ ] Coverage reports (HTML + badge en README)
- [ ] Performance benchmarking
- [ ] Lighthouse CI (Core Web Vitals)
- [ ] Deploy automático a Vercel en cada push
- [ ] Notificaciones en Slack si falla
- [ ] Build caching para speedup
- [ ] Security scanning (dependencias vulnerables)

**Archivo**: `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npx playwright test

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.js'

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit
      - uses: github/super-linter@v4

  deploy:
    runs-on: ubuntu-latest
    needs: [lint, type-check, test, e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

### 11. Análisis de Uso (Analytics)

**Estado**: 🔴 No implementado  
**Esfuerzo**: 4-6 horas  
**ROI**: ⭐⭐⭐ (Product insights)  
**Tech Stack**: Vercel Analytics + Posthog (opcional)

**Descripción**:
Recopilar métricas de uso para entender comportamiento de usuarios.

**Implementación simple** (Vercel Analytics):
```bash
npm install @vercel/analytics @vercel/web-vitals
```

```typescript
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout() {
  return (
    <html>
      <body>
        {/* ... */}
        <Analytics />
      </body>
    </html>
  )
}
```

**Métricas a rastrear**:
- Cálculos más usados
- Flujo de usuario (embudo)
- Tasa de error
- Time to interactive
- Custom events:
  - `calculation_completed`
  - `export_pdf`
  - `calculator_opened`
  - `history_accessed`

**Implementación avanzada** (Posthog):
```bash
npm install posthog-js
```

```typescript
// app/layout.tsx
import { PostHogProvider } from './providers'

export default function RootLayout() {
  return (
    <PostHogProvider>
      {/* ... */}
    </PostHogProvider>
  )
}
```

---

### 12. Documentación de API + Swagger

**Estado**: 🔴 No implementado  
**Esfuerzo**: 6-8 horas  
**ROI**: ⭐⭐⭐⭐ (Developer experience)  
**Tech Stack**: `swagger-jsdoc` + `swagger-ui-express`

**Descripción**:
Documentar API REST con Swagger/OpenAPI y UI interactiva.

**Instalación**:
```bash
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-ui-express
```

**Archivo OpenAPI**:
```typescript
// lib/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CalcEléc API',
      version: '1.0.0',
      description: 'Calculadora eléctrica basada en normas cubanas'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development'
      },
      {
        url: 'https://calcelec.app',
        description: 'Production'
      }
    ]
  },
  apis: ['./app/api/**/*.ts']
}

export const specs = swaggerJsdoc(options)
```

**Endpoint Swagger UI**:
```typescript
// app/api/docs/route.ts
import swaggerUi from 'swagger-ui-express'
import { specs } from '@/lib/swagger'

export function GET() {
  return new Response(
    swaggerUi.generateHTML(specs),
    { headers: { 'Content-Type': 'text/html' } }
  )
}
```

**URL**: `/api/docs`

---

### 13. Testing Avanzado

**Estado**: ✅ Unitarios existen. 🟡 E2E parcial  
**Esfuerzo**: 16-20 horas  
**ROI**: ⭐⭐⭐⭐ (Confiabilidad)  
**Tech Stack**: Playwright + Jest + axe-core + Percy (visual regression)

**Descripción**:
Suite completa de testing: unitarios, E2E, accesibilidad, visual.

**Componentes**:

**1. E2E Tests (Playwright)**
```typescript
// tests/e2e/complete-flow.spec.ts
import { test, expect } from '@playwright/test'

test('Complete calculation flow', async ({ page }) => {
  await page.goto('/')
  
  // Click on Ohm calculator
  await page.click('button:has-text("Ley de Ohm")')
  
  // Fill inputs
  await page.fill('input[name="voltage"]', '220')
  await page.fill('input[name="current"]', '10')
  
  // Submit
  await page.click('button:has-text("Calcular")')
  
  // Verify result
  await expect(page.locator('.result')).toContainText('2200')
})
```

**2. Accessibility Tests**
```bash
npm install @axe-core/playwright
```

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test('Page should have no accessibility violations', async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
  await checkA11y(page)
})
```

**3. Visual Regression Tests**
```bash
npm install --save-dev @percy/cli @percy/playwright
```

```typescript
// tests/e2e/visual.spec.ts
import { test, expect } from '@playwright/test'

test('Visual regression: homepage', async ({ page }) => {
  await page.goto('/')
  await percySnapshot(page, 'Homepage')
})
```

**4. Performance Tests**
```typescript
// tests/e2e/performance.spec.ts
test('Calculate should be fast', async ({ page }) => {
  await page.goto('/')
  
  const startTime = Date.now()
  await page.fill('input[name="voltage"]', '220')
  await page.fill('input[name="current"]', '10')
  await page.click('button:has-text("Calcular")')
  const duration = Date.now() - startTime
  
  expect(duration).toBeLessThan(500) // ms
})
```

---

### 14. Accesibilidad WCAG 2.1 AA

**Estado**: 🟡 Parcial (responsive, colores)  
**Esfuerzo**: 10-12 horas  
**ROI**: ⭐⭐⭐⭐ (Inclusión/Legal)  
**Tech Stack**: axe-core + ARIA + semantic HTML

**Descripción**:
Pasar auditoría WCAG 2.1 Nivel AA completa.

**Auditoría actual**:
```bash
# Instalar
npm install -D @axe-core/react

# O usar herramienta online
# https://www.deque.com/axe/devtools/
```

**Mejoras requeridas**:
- [ ] Contraste de colores: Todos los textos ≥ 4.5:1 (AA)
- [ ] Navegación por teclado:
  - [ ] Tab order lógico
  - [ ] Visible focus indicator
  - [ ] No keyboard traps
- [ ] Screen reader support:
  - [ ] ARIA labels en inputs
  - [ ] ARIA descriptions para valores complejos
  - [ ] Anuncios dinámicos (aria-live)
- [ ] Focus management:
  - [ ] Modal dialogs atrapan focus
  - [ ] Mensajes de error focusables
- [ ] Estructura semántica:
  - [ ] Headings h1, h2, h3 en orden
  - [ ] Landmarks (main, nav, aside)
  - [ ] Form labels asociados

**Checklist WCAG**:
- [ ] 1.4.3 Contrast (Minimum) - Level AA
- [ ] 2.4.3 Focus Order - Level A
- [ ] 2.4.7 Focus Visible - Level AA
- [ ] 4.1.2 Name, Role, Value - Level A
- [ ] 4.1.3 Status Messages - Level AA
- [ ] 1.3.1 Info and Relationships - Level A

**Test con screen reader**:
```bash
# Windows: Narrator (Win+Enter)
# macOS: VoiceOver (Cmd+F5)
# Linux: Orca
```

---

## 🟣 P4 - FUTURO

### 15. Base de Datos de Proyectos

**Esfuerzo**: 20-24 horas  
**Descripción**: Agrupar múltiples cálculos en proyectos editables con versioning

### 16. Integración con Normas Actualizadas

**Esfuerzo**: 12-16 horas  
**Descripción**: Auto-sync con cambios en normas NC, notificaciones de actualizaciones

### 17. Temas Personalizables

**Esfuerzo**: 8-10 horas  
**Descripción**: Editor visual de colores, guardar temas custom

### 18. Mobile App Nativa

**Esfuerzo**: 40-60 horas  
**Tech**: React Native / Flutter  
**Descripción**: App standalone iOS/Android con sínc web

### 19. Cálculos Avanzados

**Esfuerzo**: 30-40 horas  
**Descripción**: Inductancia, armónicos, flujo de carga, estabilidad transitoria

### 20. Integración CAD

**Esfuerzo**: 40-60 horas  
**Tech**: AutoCAD/DraftSight plugins  
**Descripción**: Importar diagramas, exportar cálculos a CAD

---

## 📊 RESUMEN DE ESFUERZO

| Prioridad | Cantidad | Esfuerzo Total | Tipo |
|-----------|----------|----------------|------|
| **P0** | 1 | ✅ HECHO | 🟢 Completado |
| **P1** | 4 | 30-40 h | 🟢 Alto valor |
| **P2** | 6 | 50-70 h | 🟡 Medio |
| **P3** | 5 | 34-56 h | 🔵 Mantenimiento |
| **P4** | 6 | 150-200+ h | 🟣 Largo plazo |
| **TOTAL** | **22** | **264-366 h** | |

---

## 🚀 ROADMAP RECOMENDADO (6-12 MESES)

### **Semana 1** ✅ COMPLETADA
- ✅ **P0**: Arreglar hydration mismatch (5 min) - HECHO
- ✅ Verificar `npm run dev` sin errores - FUNCIONANDO

### **Mes 1 (8 semanas)** - Stack: P1 Foundations (PRÓXIMO)
```
Week 1-2: P0 fix + P1.3 Búsqueda (6-8h)
Week 3-4: P1.2 Compartir por URL (6-10h)
Week 5-6: P3.1 CI/CD (8-10h)
Week 7-8: P1.4 Dashboard (10-14h)
```

### **Mes 2-3** - Stack: P1 Completeness + Quality
```
Mes 2:
  - P1.2 PDF mejorado (8-12h)
  - P3.2 Testing avanzado (16-20h)
  - P3.4 Accesibilidad (10-12h)

Mes 3:
  - P1.5 Multi-idioma (12-16h)
  - P3.2 Analytics (4-6h)
  - P3.3 API Swagger (6-8h)
```

### **Mes 4-6** - Stack: P2 + Enterprise
```
Mes 4:
  - P2.6 API REST (10-12h)
  - P2.1 Offline mejorado (8-10h)
  
Mes 5-6:
  - P2.3 Validación realtime (6-8h)
  - P2.8 Validación mejorada (6-8h)
  - P4.1 Proyectos (20-24h) [opcional]
```

---

## ✨ QUICK WINS (Para empezar hoy/esta semana)

### **HOY** ✅ COMPLETADO
1. ✅ **5 min**: Arreglar hydration mismatch (P0) - HECHO
2. ✅ **10 min**: Verificar que `npm run dev` funciona - ✅ FUNCIONANDO
3. ⏳ **15 min**: Merge a main y deploy a Vercel (próximo)

### **ESTA SEMANA** ⏳ PRÓXIMAS (3-5 horas)
4. **2-3 h**: P1.5 Agregar "Copiar enlace" a historial
   ```typescript
   // Botón en HistoryPanel.tsx
   <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
     Copiar enlace
   </button>
   ```

5. **1-2 h**: P2.3 Mejorar validación inputs con feedback visual
   ```typescript
   // Componente Input.tsx
   <input {...props} required onChange={handleValidation} />
   {error && <span className="text-red-500">{error}</span>}
   ```

6. **1 h**: P3.2 Agregar 5 tests E2E más con Playwright
   ```bash
   npx playwright test --headed
   ```

---

## 📝 NOTAS IMPORTANTES

- Todos los esfuerzos son estimaciones (±20%)
- Prioridades pueden cambiar según feedback de usuarios
- Quick wins pueden implementarse en paralelo
- Mantener TypeScript strict mode en todas las mejoras
- Seguir convenciones del proyecto (ver AGENTS.md, CLAUDE.md)
- Todos los cambios requieren tests y documentación
- Deploy a Vercel automático con GitHub Actions

---

**Última actualización**: Abril 3, 2026 (P0 Completada ✅)  
**Versión**: 1.1  
**Status**: 📋 P0 COMPLETADA - Próximo: P1 Foundations (Mes 1)
