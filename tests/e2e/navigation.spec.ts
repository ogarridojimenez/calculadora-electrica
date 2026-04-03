import { test, expect } from '@playwright/test';

test.describe('Navegación', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Sidebar se muestra en desktop', async ({ page }) => {
    await expect(page.locator('nav, aside')).toBeVisible();
  });

  test('Navegación a todos los módulos', async ({ page }) => {
    const modulos = [
      'Ley de Ohm',
      'Potencia Monofásica',
      'Potencia Trifásica',
      'Caída de Tensión',
      'Sección Conductor',
      'Protección',
      'Puesta a Tierra',
      'Factor de Potencia',
      'Iluminación',
      'Motor',
      'Cortocircuito',
      'Demanda',
      'Canalización',
    ];

    for (const modulo of modulos) {
      await page.click(`text=${modulo}`);
      await page.waitForTimeout(100);
    }
  });

  test('Toggle modo oscuro/claro', async ({ page }) => {
    const toggleButton = page.locator('button').filter({ has: /sol|luna|moon|sun/i });
    if (await toggleButton.count() > 0) {
      await toggleButton.first().click();
      await page.waitForTimeout(300);
    }
  });

  test('Dashboard stats visibles', async ({ page }) => {
    await expect(page.locator('text=Cálculos')).toBeVisible();
    await expect(page.locator('text=Normas')).toBeVisible();
    await expect(page.locator('text=Categorías')).toBeVisible();
  });
});
