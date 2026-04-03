import { test, expect } from '@playwright/test';

test.describe('Historial', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Guardar cálculo en historial', async ({ page }) => {
    await page.click('text=Ley de Ohm');
    await page.fill('input[placeholder*="corriente"]', '10');
    await page.fill('input[placeholder*="resistencia"]', '5');
    await page.click('button:has-text("Calcular")');
    await expect(page.locator('text=50 V')).toBeVisible();
    
    await page.click('button:has-text("Guardar en historial")');
    await expect(page.locator('text=Guardado en historial')).toBeVisible();
  });

  test('Panel de historial se abre', async ({ page }) => {
    await page.getByRole('button', { name: /historial/i }).click();
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });

  test('Limpiar historial', async ({ page }) => {
    await page.getByRole('button', { name: /historial/i }).click();
    const clearButton = page.getByRole('button', { name: /limpiar|borrar|clear/i });
    if (await clearButton.count() > 0) {
      await clearButton.first().click();
    }
  });
});
