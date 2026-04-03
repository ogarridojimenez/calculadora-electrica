# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navegación >> Navegación a todos los módulos
- Location: tests\e2e\navigation.spec.ts:13:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Navegación', () => {
  4  |   
  5  |   test.beforeEach(async ({ page }) => {
> 6  |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  7  |   });
  8  | 
  9  |   test('Sidebar se muestra en desktop', async ({ page }) => {
  10 |     await expect(page.locator('nav, aside')).toBeVisible();
  11 |   });
  12 | 
  13 |   test('Navegación a todos los módulos', async ({ page }) => {
  14 |     const modulos = [
  15 |       'Ley de Ohm',
  16 |       'Potencia Monofásica',
  17 |       'Potencia Trifásica',
  18 |       'Caída de Tensión',
  19 |       'Sección Conductor',
  20 |       'Protección',
  21 |       'Puesta a Tierra',
  22 |       'Factor de Potencia',
  23 |       'Iluminación',
  24 |       'Motor',
  25 |       'Cortocircuito',
  26 |       'Demanda',
  27 |       'Canalización',
  28 |     ];
  29 | 
  30 |     for (const modulo of modulos) {
  31 |       await page.click(`text=${modulo}`);
  32 |       await page.waitForTimeout(100);
  33 |     }
  34 |   });
  35 | 
  36 |   test('Toggle modo oscuro/claro', async ({ page }) => {
  37 |     const toggleButton = page.locator('button').filter({ has: /sol|luna|moon|sun/i });
  38 |     if (await toggleButton.count() > 0) {
  39 |       await toggleButton.first().click();
  40 |       await page.waitForTimeout(300);
  41 |     }
  42 |   });
  43 | 
  44 |   test('Dashboard stats visibles', async ({ page }) => {
  45 |     await expect(page.locator('text=Cálculos')).toBeVisible();
  46 |     await expect(page.locator('text=Normas')).toBeVisible();
  47 |     await expect(page.locator('text=Categorías')).toBeVisible();
  48 |   });
  49 | });
  50 | 
```