import { test, expect } from '@playwright/test';

test.describe('Cálculos Eléctricos - 17 Módulos', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Ley de Ohm - Calcular Voltaje', async ({ page }) => {
    await page.click('text=Ley de Ohm');
    await expect(page.locator('h2')).toContainText('Ley de Ohm');
    
    await page.fill('input[placeholder*="corriente"]', '10');
    await page.fill('input[placeholder*="resistencia"]', '5');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=50 V')).toBeVisible();
  });

  test('2. Ley de Ohm - Calcular Corriente', async ({ page }) => {
    await page.click('text=Ley de Ohm');
    
    await page.click('button:has-text("Corriente")');
    await page.fill('input[placeholder*="voltaje"]', '220');
    await page.fill('input[placeholder*="resistencia"]', '22');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=10 A')).toBeVisible();
  });

  test('3. Ley de Ohm - Calcular Resistencia', async ({ page }) => {
    await page.click('text=Ley de Ohm');
    
    await page.click('button:has-text("Resistencia")');
    await page.fill('input[placeholder*="voltaje"]', '220');
    await page.fill('input[placeholder*="corriente"]', '20');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=11 Ω')).toBeVisible();
  });

  test('4. Potencia Monofásica', async ({ page }) => {
    await page.click('text=Potencia Monofásica');
    await expect(page.locator('h2')).toContainText('Potencia Monofásica');
    
    await page.fill('input[type="number"] >> nth=0', '220');
    await page.fill('input[type="number"] >> nth=1', '10');
    await page.fill('input[type="number"] >> nth=2', '0.85');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=W')).toBeVisible();
  });

  test('5. Potencia Trifásica', async ({ page }) => {
    await page.click('text=Potencia Trifásica');
    await expect(page.locator('h2')).toContainText('Potencia Trifásica');
    
    await page.fill('input[type="number"] >> nth=0', '380');
    await page.fill('input[type="number"] >> nth=1', '20');
    await page.fill('input[type="number"] >> nth=2', '0.85');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=W')).toBeVisible();
  });

  test('6. Caída de Tensión', async ({ page }) => {
    await page.click('text=Caída de Tensión');
    await expect(page.locator('h2')).toContainText('Caída de Tensión');
    
    await page.fill('input[type="number"] >> nth=0', '220');
    await page.fill('input[type="number"] >> nth=1', '10');
    await page.fill('input[type="number"] >> nth=2', '100');
    await page.fill('input[type="number"] >> nth=3', '6');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=%')).toBeVisible();
  });

  test('7. Sección Conductor', async ({ page }) => {
    await page.click('text=Sección Conductor');
    await expect(page.locator('h2')).toContainText('Sección Conductor');
    
    await page.fill('input[type="number"] >> nth=0', '30');
    await page.selectOption('select >> nth=0', { label: 'Cobre' });
    await page.selectOption('select >> nth=1', { label: 'Trifásico' });
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=mm²')).toBeVisible();
  });

  test('8. Protección', async ({ page }) => {
    await page.click('text=Protección');
    await expect(page.locator('h2')).toContainText('Protección');
    
    await page.fill('input[type="number"]', '25');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=A')).toBeVisible();
  });

  test('9. Puesta a Tierra', async ({ page }) => {
    await page.click('text=Puesta a Tierra');
    await expect(page.locator('h2')).toContainText('Puesta a Tierra');
    
    await page.fill('input[type="number"] >> nth=0', '50');
    await page.fill('input[type="number"] >> nth=1', '2.5');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=Ω')).toBeVisible();
  });

  test('10. Factor de Potencia', async ({ page }) => {
    await page.click('text=Factor de Potencia');
    await expect(page.locator('h2')).toContainText('Factor de Potencia');
    
    await page.fill('input[type="number"] >> nth=0', '10');
    await page.fill('input[type="number"] >> nth=1', '0.80');
    await page.fill('input[type="number"] >> nth=2', '0.95');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=kVAr')).toBeVisible();
  });

  test('11. Iluminación', async ({ page }) => {
    await page.click('text=Iluminación');
    await expect(page.locator('h2')).toContainText('Iluminación');
    
    await page.fill('input[type="number"] >> nth=0', '500');
    await page.fill('input[type="number"] >> nth=1', '100');
    await page.fill('input[type="number"] >> nth=2', '0.8');
    await page.fill('input[type="number"] >> nth=3', '0.75');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=lm')).toBeVisible();
  });

  test('12. Motor', async ({ page }) => {
    await page.click('text=Motor');
    await expect(page.locator('h2')).toContainText('Motor');
    
    await page.fill('input[type="number"]', '5');
    await page.selectOption('select', { label: '380 V' });
    await page.selectOption('select >> nth=1', { label: 'Directo' });
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=A')).toBeVisible();
  });

  test('13. Cortocircuito', async ({ page }) => {
    await page.click('text=Cortocircuito');
    await expect(page.locator('h2')).toContainText('Cortocircuito');
    
    await page.fill('input[type="number"] >> nth=0', '380');
    await page.fill('input[type="number"] >> nth=1', '100');
    await page.fill('input[type="number"] >> nth=2', '50');
    await page.selectOption('select', { label: 'Cobre' });
    await page.fill('input[type="number"] >> nth=3', '25');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=kA')).toBeVisible();
  });

  test('14. Demanda', async ({ page }) => {
    await page.click('text=Demanda');
    await expect(page.locator('h2')).toContainText('Demanda');
    
    await page.fill('input[type="number"] >> nth=0', '5000');
    await page.selectOption('select', { label: 'Residencial' });
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=kW')).toBeVisible();
  });

  test('15. Canalización', async ({ page }) => {
    await page.click('text=Canalización');
    await expect(page.locator('h2')).toContainText('Canalización');
    
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=%')).toBeVisible();
  });

  test('16. Ampacidad Corregida', async ({ page }) => {
    await page.click('text=Ampacidad');
    await expect(page.locator('h2')).toContainText('Ampacidad');
    
    await page.selectOption('select >> nth=0', { label: '10 mm²' });
    await page.fill('input[type="number"] >> nth=0', '35');
    await page.fill('input[type="number"] >> nth=1', '1');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=A')).toBeVisible();
  });

  test('17. Caída de Tensión Avanzada', async ({ page }) => {
    await page.click('text=Caída de Tensión Avanzada');
    await expect(page.locator('h2')).toContainText('Caída de Tensión Avanzada');
    
    await page.selectOption('select >> nth=0', { label: '10 mm²' });
    await page.fill('input[type="number"] >> nth=0', '100');
    await page.fill('input[type="number"] >> nth=1', '30');
    await page.fill('input[type="number"] >> nth=2', '220');
    await page.fill('input[type="number"] >> nth=3', '0.85');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=%')).toBeVisible();
  });

  test('18. Motor por FLA', async ({ page }) => {
    await page.click('text=Motor por FLA');
    await expect(page.locator('h2')).toContainText('Motor por FLA');
    
    await page.selectOption('select >> nth=0', { label: '5 HP' });
    await page.selectOption('select >> nth=1', { label: '380 V' });
    await page.fill('input[type="number"]', '35');
    await page.fill('input[type="number"] >> nth=1', '1');
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=A')).toBeVisible();
  });

  test('19. Conduit', async ({ page }) => {
    await page.click('text=Conduit');
    await expect(page.locator('h2')).toContainText('Conduit');
    
    await page.click('button:has-text("Calcular")');
    
    await expect(page.locator('text=%')).toBeVisible();
  });
});
