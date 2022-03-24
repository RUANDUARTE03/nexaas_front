import { test, expect } from '@playwright/test';

const REACT_URL = process.env.REACT_URL ?? '';
const PROVIDER_HOME = `${REACT_URL}/providers`;
test('Menu click should redirect', async ({ page }) => {
  // Go to http://localhost:3000/
  await page.goto('http://localhost:3000/');
  // Click button:has-text("Cadastros")
  await page
    .locator('button:has-text("Cadastros")')
    .click();
  // Click a:has-text("Fornecedores")
  await Promise.all([
    page.waitForNavigation({
      url: 'http://localhost:3001/providers',
    }),
    page.locator('a:has-text("Fornecedores")').click(),
  ]);
});
