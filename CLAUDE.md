# Instrucciones para Claude - Proyecto Next.js Web App

## Sobre mí
- Desarrollador TypeScript/JavaScript (nivel a completar)
- Proyecto: Aplicación web con Next.js
- Idioma preferido: Español para comunicación, inglés para código

## Stack Tecnológico
- **Lenguaje**: TypeScript 5.x (strict mode)
- **Framework**: Next.js 14+ (App Router)
- **Estilos**: Tailwind CSS
- **UI Components**: shadcn/ui (o componentes propios)
- **Estado**: Zustand / React Context (según complejidad)
- **Fetching**: TanStack Query (React Query) o Server Components nativos
- **Formularios**: React Hook Form + Zod
- **Base de datos**: (por definir - Prisma + PostgreSQL, SQLite, etc.)
- **Auth**: (por definir - NextAuth.js, Clerk, etc.)
- **Empaquetado/Deploy**: Vercel, Docker, o VPS

## Convenciones de Código TypeScript

### Estilo
- Seguir las reglas de ESLint + Prettier (configuración estándar de Next.js)
- Usar `camelCase` para variables, funciones y métodos
- Usar `PascalCase` para componentes React, clases e interfaces/types
- Usar `UPPER_CASE` para constantes de configuración
- Máximo 100 caracteres por línea
- Siempre usar `const` por defecto, `let` solo si la variable muta, nunca `var`

### TypeScript Estricto
- Activar `strict: true` en `tsconfig.json` — sin excepciones
- **NUNCA** usar `any`. Alternativas: `unknown`, generics, o tipos específicos
- Usar `type` para uniones/intersecciones; usar `interface` para objetos extensibles
- Preferir inferencia de tipos cuando es obvia; anotar cuando mejora la legibilidad

```typescript
// ✅ Correcto
type Status = 'idle' | 'loading' | 'success' | 'error'

interface UserProfile {
  id: string
  email: string
  displayName: string
  createdAt: Date
}

const fetchUser = async (id: string): Promise<UserProfile> => {
  // ...
}

// ❌ Incorrecto
const fetchUser = async (id: any): Promise<any> => { ... }
```

### Imports
Ordenar con `@trivago/prettier-plugin-sort-imports` o manualmente:
1. Módulos de Node / built-ins
2. Librerías de terceros (`react`, `next`, etc.)
3. Alias internos (`@/components`, `@/lib`, etc.)
4. Imports relativos

```typescript
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'

import { UserCard } from './user-card'
```

## Estructura del Proyecto (App Router)

```
proyecto/
├── app/                        # App Router (Next.js 13+)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css
│   ├── (auth)/                 # Route group - autenticación
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/                    # API Routes (Route Handlers)
│       └── users/
│           └── route.ts
├── components/
│   ├── ui/                     # Componentes base/primitivos
│   ├── forms/                  # Componentes de formularios
│   ├── layout/                 # Header, Footer, Sidebar
│   └── features/               # Componentes específicos de negocio
├── lib/
│   ├── db.ts                   # Cliente de base de datos
│   ├── auth.ts                 # Configuración de autenticación
│   ├── utils.ts                # Helpers generales
│   └── validations/            # Schemas de Zod
├── hooks/                      # Custom React hooks
├── stores/                     # Zustand stores (si aplica)
├── types/                      # Tipos e interfaces globales
├── public/                     # Assets estáticos
├── .env.local                  # Variables de entorno locales
├── .env.example                # Plantilla de variables (commiteada)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Next.js - Patrones y Mejores Prácticas

### Server vs Client Components
- **Por defecto: Server Components**. Agregar `'use client'` solo cuando sea necesario
- Usar Client Components solo para: interactividad, hooks de estado/efecto, eventos del browser
- Mantener los Client Components lo más abajo posible en el árbol de componentes

```typescript
// app/dashboard/page.tsx — Server Component (sin directiva)
import { UserList } from '@/components/features/user-list'
import { db } from '@/lib/db'

export default async function DashboardPage() {
  const users = await db.user.findMany()  // fetch directo en servidor ✅
  return <UserList users={users} />
}

// components/features/user-list.tsx — Client Component (solo si necesita interactividad)
'use client'

import { useState } from 'react'

interface UserListProps {
  users: UserProfile[]
}

export function UserList({ users }: UserListProps) {
  const [selected, setSelected] = useState<string | null>(null)
  // ...
}
```

### Estructura de Componentes
- Un componente por archivo
- Exportar con nombre (named export), no default, salvo en `page.tsx` y `layout.tsx`
- Extraer subcomponentes grandes a archivos propios

```typescript
// ✅ Estructura recomendada
interface ComponentNameProps {
  // props tipadas siempre
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // hooks al inicio
  // lógica derivada
  // handlers
  // render
}
```

### Data Fetching
- Preferir Server Components con `async/await` directo para datos estáticos o por solicitud
- Usar TanStack Query para datos en tiempo real, con mutaciones frecuentes, o en Client Components
- Usar `loading.tsx` y `error.tsx` de Next.js para estados de carga/error por ruta

```typescript
// Route Handler tipado
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createUserSchema.parse(body)  // valida y tipea
    // ...
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.flatten() }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## Seguridad y Validación (OBLIGATORIO)

### Validación con Zod
- **NUNCA** confiar en datos del cliente — validar TODO en el servidor
- Definir schemas de Zod en `lib/validations/` y reutilizarlos en formularios y API routes
- Inferir tipos de TypeScript desde los schemas (no duplicar)

```typescript
// lib/validations/user.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(100),
  displayName: z.string().min(2).max(50).trim(),
})

// Inferir tipo desde el schema — NO duplicar con interface manual
export type CreateUserInput = z.infer<typeof createUserSchema>
```

### Formularios Seguros con React Hook Form + Zod
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema, type CreateUserInput } from '@/lib/validations/user'

export function CreateUserForm() {
  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', password: '', displayName: '' },
  })

  const onSubmit = async (data: CreateUserInput) => {
    // data ya está validado y tipado ✅
    try {
      await createUser(data)
    } catch (error) {
      form.setError('root', { message: 'Error al crear usuario' })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* campos */}
    </form>
  )
}
```

### Manejo de Errores
- Usar bloques `try/catch` específicos, nunca catch vacíos
- Distinguir entre errores de usuario (400) y errores de servidor (500)
- **NUNCA** exponer stack traces, queries de BD, o información interna al cliente
- Loggear errores del servidor con un logger estructurado (ej: `pino`, `winston`)

```typescript
import { logger } from '@/lib/logger'

// ✅ Mensaje amigable al usuario, detalle en logs del servidor
try {
  await db.user.create({ data })
} catch (error) {
  logger.error({ error, context: 'createUser' }, 'Database error')
  // Al cliente solo va un mensaje genérico:
  throw new Error('No se pudo crear el usuario. Intenta de nuevo.')
}
```

### Seguridad en Variables de Entorno
- Variables solo de servidor: sin prefijo `NEXT_PUBLIC_` (nunca exponer al browser)
- Variables de cliente: solo con prefijo `NEXT_PUBLIC_` y nunca datos sensibles
- Validar variables de entorno al inicio con Zod

```typescript
// lib/env.ts — ejecuta en build/start, falla rápido si falta algo
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

### Prevención de Vulnerabilidades Web
- **XSS**: Nunca usar `dangerouslySetInnerHTML` sin sanitizar (usar `DOMPurify` si es necesario)
- **CSRF**: Usar tokens CSRF o verificar el header `Origin` en mutations
- **SQL Injection**: Usar siempre el ORM (Prisma) o queries parametrizadas, nunca strings concatenados
- **Path Traversal**: Validar que rutas de archivo estén dentro de directorios permitidos
- **Rate Limiting**: Aplicar en API Routes con `upstash/ratelimit` o middleware propio

```typescript
// ❌ Peligroso
const user = await db.$queryRaw(`SELECT * FROM users WHERE id = ${userId}`)

// ✅ Seguro
const user = await db.user.findUnique({ where: { id: userId } })
```

### Autenticación y Autorización
- Verificar sesión/permisos en Server Components y Route Handlers — nunca solo en el cliente
- Usar middleware de Next.js para proteger rutas a nivel de edge

```typescript
// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()

  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
}
```

## Flujo de Trabajo

### Antes de hacer cambios
1. Leer el archivo relevante para entender el contexto
2. Explicar brevemente el plan antes de escribir código
3. Preguntar si hay dependencias o decisiones de arquitectura que deba conocer

### Durante el desarrollo
- Código TypeScript estricto, sin `any`
- Type hints explícitos en props, parámetros de función y retornos de funciones públicas
- Documentar funciones complejas con JSDoc
- Mantener componentes y funciones pequeños, con una sola responsabilidad
- Preferir composición sobre herencia

### Después de cambios
- Verificar que no haya errores de TypeScript (`npx tsc --noEmit`)
- Sugerir cómo probar el cambio
- No ejecutar comandos sin permiso explícito

## Qué Evitar
- **NUNCA** usar `any` en TypeScript — sin excepciones
- **NUNCA** exponer secretos o datos sensibles al cliente (verificar `NEXT_PUBLIC_`)
- **NUNCA** confiar en datos del cliente sin validar con Zod en el servidor
- **NUNCA** usar `dangerouslySetInnerHTML` sin sanitización
- **NUNCA** bloquear el Event Loop con operaciones síncronas costosas
- No usar `Pages Router` — siempre `App Router`
- No hardcodear URLs, tokens o configuraciones — usar variables de entorno
- No hacer fetch de datos en Client Components si puede hacerse en el Server
- No mezclar lógica de negocio dentro de los componentes (extraer a `lib/` o `hooks/`)
- No ignorar errores con catch vacíos: `catch (_) {}`
- No usar `console.log` en producción — usar un logger estructurado

## Comandos Útiles
```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Verificar tipos TypeScript (sin compilar)
npx tsc --noEmit

# Lint
npm run lint

# Build de producción
npm run build

# Iniciar en producción
npm run start

# Instalar shadcn/ui component
npx shadcn@latest add button

# Generar cliente Prisma (si se usa BD)
npx prisma generate

# Aplicar migraciones
npx prisma migrate dev --name descripcion
```

## Notas Adicionales
- Next.js 14+ requiere Node.js 18.17+
- Usar `next/image` siempre para imágenes (optimización automática)
- Usar `next/link` siempre para navegación interna (prefetching)
- Para fuentes: usar `next/font` (sin layout shift, sin peticiones externas)
- Para íconos: `lucide-react` (tree-shakeable, consistente con shadcn/ui)
- Para fechas: `date-fns` (lightweight, modular) — evitar `moment.js`
- Para deploy inicial: Vercel es la opción zero-config recomendada
