import { test, expect, Page } from '@playwright/test';

const REACT_URL = process.env.REACT_URL ?? '';
const BRAND_HOME = `${REACT_URL}/product_brands`;
const BRAND_CREATE = `${BRAND_HOME}/create`;
const HOME_URL = process.env.HOME_URL ?? '';

const createBrand = {
  nameBrand: 'New Brand PlayWright',
  manufacturerBrand: '1',
  manufacturerBrandValue: 'Dell Corporation',
};

test.describe.serial('New Brand', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Menu click should redirect', async () => {
    await page.goto(HOME_URL);

    await page
      .locator('button:has-text("Cadastros")')
      .click();

    await Promise.all([
      page.waitForNavigation({
        url: BRAND_HOME,
      }),
      page.locator('a:has-text("Marcas")').click(),
    ]);

    await expect(page).toHaveURL(BRAND_HOME);
  });

  test('Clique botão nova marca deve entrar no cadastro', async () => {
    await Promise.all([
      page.waitForNavigation({
        url: BRAND_CREATE,
      }),
      page
        .locator('[data-testid="btn-create-brand"]')
        .click(),
    ]);

    await expect(page).toHaveURL(BRAND_CREATE);
  });

  test('Criar nova marca', async () => {
    await page
      .locator('[data-cy=name-brand] > input')
      .fill(createBrand.nameBrand);

    await page
      .locator('[data-cy=manufacturer-brand] > select')
      .selectOption(createBrand.manufacturerBrand);

    await Promise.all([
      page.waitForNavigation({
        url: BRAND_HOME,
      }),
      page
        .locator('[data-testid="btn-createOrEditBrand"]')
        .click(),
    ]);

    await expect(page).toHaveURL(BRAND_HOME);
  });

  test('Listagem de marcas com dados completos', async () => {
    const brandSelector =
      '[data-cy="New-Brand-PlayWright"] > td';

    await expect(
      page.locator(brandSelector).nth(0)
    ).toContainText(createBrand.nameBrand);

    await expect(
      page.locator(brandSelector).nth(1)
    ).toContainText(createBrand.manufacturerBrandValue);
  });

  test('Botões de edição e exclusão devem ser renderizados', async () => {
    const editSelector = `[data-cy="btn-edit-brand-${createBrand.nameBrand.replace(
      ' ',
      '-'
    )}"]`;
    const deleteSelector = `[data-cy="btn-delete-brand-${createBrand.nameBrand.replace(
      ' ',
      '-'
    )}"]`;

    await expect(page.locator(editSelector)).toBeVisible();
    await expect(
      page.locator(deleteSelector)
    ).toBeVisible();
  });
});
