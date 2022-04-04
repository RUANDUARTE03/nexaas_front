import { test, expect, Page } from '@playwright/test';

const REACT_URL = process.env.REACT_URL ?? '';
const BRAND_HOME = `${REACT_URL}/product_brands`;
const BRAND_CREATE = `${BRAND_HOME}/create`;
const HOME_URL = process.env.HOME_URL ?? '';

const brand = {
  name: 'Marca teste',
  manufacturer: '1',
};

test.describe.serial('Brand tests', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Clique no menu deve redirecionar', async () => {
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
      .locator('[data-cy=name] > input')
      .fill(brand.name);

    await page
      .locator('[data-cy=manufacturer] > select')
      .selectOption(brand.manufacturer);

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

  test('Validação de dados obrigatórios', async () => {
    await Promise.all([
      page.waitForNavigation({
        url: BRAND_CREATE,
      }),
      page
        .locator('[data-testid="btn-create-brand"]')
        .click(),
    ]);

    await page
      .locator('[data-testid="btn-createOrEditBrand"]')
      .click();

    await expect(page).toHaveURL(BRAND_CREATE);

    await expect(
      page.locator('.MuiAlert-message')
    ).toContainText('Nome não pode ficar em branco');

    await expect(
      page.locator('.MuiAlert-message')
    ).toContainText('Manufacturer não é válido');

    await expect(
      page.locator('[data-cy=name-error]')
    ).toContainText('Nome não pode ficar em branco');

    await expect(
      page.locator('[data-cy=manufacturer-error]')
    ).toContainText('Manufacturer não é válido');

    await page
      .locator(
        '[data-testid="btn-createOrEditBrand-cancel"]'
      )
      .click();
  });

  test('Edição: Validação de dados obrigatórios', async () => {
    await page
      .locator(`[data-cy="btn-edit-brand-Marca-teste"]`)
      .click();

    await page.locator('[data-cy=name] > input').fill('');

    await page
      .locator('[data-testid="btn-createOrEditBrand"]')
      .click();

    await expect(
      page.locator('.MuiAlert-message')
    ).toContainText('Nome não pode ficar em branco');

    await expect(
      page.locator('[data-cy=name-error]')
    ).toContainText('Nome não pode ficar em branco');

    await page
      .locator(
        '[data-testid="btn-createOrEditBrand-cancel"]'
      )
      .click();
  });

  test('Edição: Atualização cadastral com sucesso', async () => {
    await page
      .locator(`[data-cy="btn-edit-brand-Marca-teste"]`)
      .click();

    await page
      .locator('[data-cy=name] > input')
      .fill('editado');

    await page
      .locator('[data-cy=manufacturer] > select')
      .selectOption(brand.manufacturer);

    await page
      .locator('[data-testid="btn-createOrEditBrand"]')
      .click();

    await Promise.all([
      page.waitForNavigation({
        url: BRAND_HOME,
      }),
      page
        .locator('[data-testid="btn-createOrEditBrand"]')
        .click(),
    ]);
  });

  test('Listagem de Marcas: Marcas com dados básicos', async () => {
    const selector = '[data-cy="editado"] > td';

    await expect(
      page.locator(selector).nth(0)
    ).toContainText('editado');

    await expect(
      page.locator(selector).nth(1)
    ).toContainText('Dell Corporation');
  });

  test('Cancelar modal ao tentar remover marca', async () => {
    await page
      .locator(`[data-cy="btn-delete-brand-editado"]`)
      .click();

    await expect(
      page.locator('[data-testid="container-delete-modal"]')
    ).toContainText('Remover Marca');

    await page
      .locator('[data-cy="btn-delete-close"]')
      .click();
  });

  test('Remover marca com sucesso', async () => {
    await page
      .locator(`[data-cy="btn-delete-brand-editado"]`)
      .click();

    await expect(
      page.locator('[data-testid="container-delete-modal"]')
    ).toContainText('Remover Marca');

    await page
      .locator('[data-cy="btn-delete-confirm"]')
      .click();

    await expect(
      page.locator('.MuiAlert-message')
    ).toContainText('marca excluído(a) com sucesso');
  });
});
