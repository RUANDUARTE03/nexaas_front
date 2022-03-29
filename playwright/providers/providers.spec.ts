import { test, expect, Page } from '@playwright/test';

const REACT_URL = process.env.REACT_URL ?? '';
const PROVIDER_HOME = `${REACT_URL}/providers`;
const PROVIDER_CREATE = `${PROVIDER_HOME}/create`;
const HOME_URL = process.env.HOME_URL ?? '';

const completeProvider = {
  city: 'Niterói',
  cityCode: '3303302',
  country: 'Brazil',
  detail: 'teste',
  document: '29979036000140',
  externalId: '1234',
  name: 'teste 123',
  neighborhood: 'Largo da Batalha',
  number: '21',
  providerType: 'Fabricante',
  state: 'RJ',
  stateInscription: '12341234',
  stateInscriptionType: '1',
  street: 'Rua Miguel Pereira Sarmento',
  tradingName: 'teste 123',
  zipcode: '24310425',
};

const onlyRequiredProvider = {
  name: 'required provider',
  document: '34028316000294',
  providerType: 'Fabricante',
};

test.describe.serial('New Todo', () => {
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
        url: PROVIDER_HOME,
      }),
      page.locator('a:has-text("Fornecedores")').click(),
    ]);

    await expect(page).toHaveURL(PROVIDER_HOME);
  });

  test('Clique botão novo fornecedor deve entrar no cadastro', async () => {
    await Promise.all([
      page.waitForNavigation({
        url: PROVIDER_CREATE,
      }),
      page
        .locator('[data-testid="btn-create-provider"]')
        .click(),
    ]);

    await expect(page).toHaveURL(PROVIDER_CREATE);
  });

  test('Criar novo fornecedor', async () => {
    await page
      .locator('[data-cy=identifier] > input')
      .fill(completeProvider.document);

    await page
      .locator('[data-cy=companyName] > input')
      .fill(completeProvider.name);

    await page
      .locator('[data-cy=fantasyName] > input')
      .fill(completeProvider.tradingName);

    await page
      .locator('[data-cy=typeProvider] > select')
      .selectOption(completeProvider.providerType);

    await page
      .locator('[data-cy=indicatorSign] > select')
      .selectOption(completeProvider.stateInscriptionType);

    await page
      .locator('[data-cy=identifierExternal] > input')
      .fill(completeProvider.externalId);

    await page
      .locator('[data-cy=stateInscription] > input')
      .fill(completeProvider.stateInscription);

    await page
      .locator('[data-cy=formattedZipCode] > input')
      .fill(completeProvider.zipcode);

    await page
      .locator('[data-cy=stateName] > select')
      .selectOption(completeProvider.state);

    await Promise.all([
      page.waitForNavigation({
        url: PROVIDER_HOME,
      }),
      page
        .locator('[data-testid="btn-createOrEditProvider"]')
        .click(),
    ]);

    await expect(page).toHaveURL(PROVIDER_HOME);
  });

  test('Criar novo fornecedor somente com dados obrigatórios', async () => {
    await Promise.all([
      page.waitForNavigation({
        url: PROVIDER_CREATE,
      }),
      page
        .locator('[data-testid="btn-create-provider"]')
        .click(),
    ]);

    await page
      .locator('[data-cy=identifier] > input')
      .fill(onlyRequiredProvider.document);

    await page
      .locator('[data-cy=companyName] > input')
      .fill(onlyRequiredProvider.name);

    await page
      .locator('[data-cy=typeProvider] > select')
      .selectOption(onlyRequiredProvider.providerType);

    await Promise.all([
      page.waitForNavigation({
        url: PROVIDER_HOME,
      }),
      page
        .locator('[data-testid="btn-createOrEditProvider"]')
        .click(),
    ]);

    await expect(page).toHaveURL(PROVIDER_HOME);
  });

  test('Listagem de fornecedores com dados completos', async () => {
    const documentSelector =
      '[data-cy="29979036000140"] > td';

    await expect(
      page.locator(documentSelector).nth(0)
    ).toContainText('29.979.036/0001-40');

    await expect(
      page.locator(documentSelector).nth(1)
    ).toContainText(completeProvider.name);

    await expect(
      page.locator(documentSelector).nth(2)
    ).toContainText(completeProvider.tradingName);

    await expect(
      page.locator(documentSelector).nth(3)
    ).toContainText(completeProvider.providerType);
  });

  test('Listagem de fornecedores com dados obrigatórios', async () => {
    const documentSelector =
      '[data-cy="34028316000294"] > td';

    await expect(
      page.locator(documentSelector).nth(0)
    ).toContainText('34.028.316/0002-94');

    await expect(
      page.locator(documentSelector).nth(1)
    ).toContainText(onlyRequiredProvider.name);

    await expect(
      page.locator(documentSelector).nth(2)
    ).toBeEmpty();

    await expect(
      page.locator(documentSelector).nth(3)
    ).toContainText(onlyRequiredProvider.providerType);
  });

  test('Botões de edição e exclusão devem ser renderizados', async () => {
    const editSelector = `[data-cy="btn-edit-provider-${completeProvider.document}"]`;
    const deleteSelector = `[data-cy="btn-delete-provider-${completeProvider.document}"]`;

    await expect(page.locator(editSelector)).toBeVisible();
    await expect(
      page.locator(deleteSelector)
    ).toBeVisible();
  });

  test('CPF/CNPJ já existente', async () => {
    await Promise.all([
      page.waitForNavigation({
        url: PROVIDER_CREATE,
      }),
      page
        .locator('[data-testid="btn-create-provider"]')
        .click(),
    ]);

    await page
      .locator('[data-cy=identifier] > input')
      .fill(onlyRequiredProvider.document);

    page
      .locator('[data-testid="btn-createOrEditProvider"]')
      .click();

    await expect(
      page.locator('.MuiAlert-message')
    ).toContainText('já está em uso');

    await expect(page).toHaveURL(PROVIDER_CREATE);

    await page
      .locator(
        '[data-testid="btn-createOrEditProvider-cancel"]'
      )
      .click();
  });

  test('CEP existente deve preencher endereço', async () => {
    await Promise.all([
      page.waitForNavigation({
        url: PROVIDER_CREATE,
      }),
      page
        .locator('[data-testid="btn-create-provider"]')
        .click(),
    ]);

    await Promise.all([
      page.waitForRequest(
        'https://viacep.com.br/ws/07400295/json'
      ),
      await page
        .locator('[data-cy=formattedZipCode] > input')
        .type('07400295'),
    ]);
    await expect(
      page.locator('[data-cy=street] > input')
    ).toHaveValue('Rua Perfeita Liberdade');

    await expect(
      page.locator('[data-cy=district] > input')
    ).toHaveValue('Jardim Ângelo');

    await expect(
      page.locator('[data-cy=city] > input')
    ).toHaveValue('Arujá');

    await expect(
      page.locator('[data-cy=cityIbgeId] > input')
    ).toHaveValue('3503901');

    await expect(
      page.locator('[data-cy=stateName] > select')
    ).toHaveValue('SP');

    await page
      .locator(
        '[data-testid="btn-createOrEditProvider-cancel"]'
      )
      .click();
  });

  test('CEP inexistente não deve preencher endereço', async () => {
    await Promise.all([
      page.waitForNavigation({
        url: PROVIDER_CREATE,
      }),
      page
        .locator('[data-testid="btn-create-provider"]')
        .click(),
    ]);

    await Promise.all([
      page.waitForRequest(
        'https://viacep.com.br/ws/12345678/json'
      ),
      await page
        .locator('[data-cy=formattedZipCode] > input')
        .type('12345678'),
    ]);
    await expect(
      page.locator('[data-cy=street] > input')
    ).toBeEmpty();

    await expect(
      page.locator('[data-cy=district] > input')
    ).toBeEmpty();

    await expect(
      page.locator('[data-cy=city] > input')
    ).toBeEmpty();

    await expect(
      page.locator('[data-cy=cityIbgeId] > input')
    ).toBeEmpty();

    await page
      .locator(
        '[data-testid="btn-createOrEditProvider-cancel"]'
      )
      .click();
  });

  test('Editar somente campos obrigatórios', async () => {
    await page
      .locator(
        `[data-cy=btn-edit-provider-${completeProvider.document}]`
      )
      .click();

    await page
      .locator('[data-cy=companyName] > input')
      .fill('nome modificado');

    await page
      .locator('[data-cy=typeProvider] > select')
      .selectOption(onlyRequiredProvider.providerType);

    await Promise.all([
      page.waitForNavigation({
        url: PROVIDER_HOME,
      }),
      page
        .locator('[data-testid="btn-createOrEditProvider"]')
        .click(),
    ]);

    await expect(page).toHaveURL(PROVIDER_HOME);
  });

  test('Editar todos os campos', async () => {
    await page
      .locator(
        `[data-cy=btn-edit-provider-${completeProvider.document}]`
      )
      .click();

    await page
      .locator('[data-cy=companyName] > input')
      .fill('nome modificado 2');

    await page
      .locator('[data-cy=fantasyName] > input')
      .fill('nome modificado 2');

    await page
      .locator('[data-cy=typeProvider] > select')
      .selectOption('Distribuidora');

    await page
      .locator('[data-cy=indicatorSign] > select')
      .selectOption('2');

    await page
      .locator('[data-cy=identifierExternal] > input')
      .fill('6');

    await page
      .locator('[data-cy=stateInscription] > input')
      .fill('12344321');

    await page
      .locator('[data-cy=formattedZipCode] > input')
      .type('07400295');

    await page
      .locator('[data-cy=stateName] > select')
      .selectOption('SP');

    await Promise.all([
      page.waitForNavigation({
        url: PROVIDER_HOME,
      }),
      page
        .locator('[data-testid="btn-createOrEditProvider"]')
        .click(),
    ]);

    await expect(page).toHaveURL(PROVIDER_HOME);
  });

  test('Editar somente campos não obrigatórios deve falhar e apresentar erro', async () => {
    await page
      .locator(
        `[data-cy=btn-edit-provider-${completeProvider.document}]`
      )
      .click();

    await page
      .locator('[data-cy=identifier] > input')
      .fill('');

    await page
      .locator('[data-cy=companyName] > input')
      .fill('');

    await page
      .locator('[data-cy=fantasyName] > input')
      .fill('nome modificado 2');

    await page
      .locator('[data-cy=indicatorSign] > select')
      .selectOption('2');

    await page
      .locator('[data-cy=identifierExternal] > input')
      .fill('6');

    await page
      .locator('[data-cy=stateInscription] > input')
      .fill('12344321');

    await page
      .locator('[data-cy=formattedZipCode] > input')
      .type('07400295');

    await page
      .locator('[data-cy=stateName] > select')
      .selectOption('SP');

    page
      .locator('[data-testid="btn-createOrEditProvider"]')
      .click();

    await expect(
      page.locator('.MuiAlert-message')
    ).toContainText('Erro ao Editar fornecedor.');

    await page
      .locator(
        '[data-testid="btn-createOrEditProvider-cancel"]'
      )
      .click();
  });

  test('Cancelar modal ao tentar remover fornecedor', async () => {
    await page
      .locator(
        `[data-cy="btn-delete-provider-${completeProvider.document}"]`
      )
      .click();

    await expect(
      page.locator('[data-testid="container-delete-modal"]')
    ).toContainText('Remover fornecedor');

    await page
      .locator('[data-cy="btn-delete-close"]')
      .click();
  });

  test('Remover fornecedor com sucesso', async () => {
    await page
      .locator(
        `[data-cy="btn-delete-provider-${completeProvider.document}"]`
      )
      .click();

    await expect(
      page.locator('[data-testid="container-delete-modal"]')
    ).toContainText('Remover fornecedor');

    await page
      .locator('[data-cy="btn-delete-confirm"]')
      .click();

    await expect(
      page.locator('.MuiAlert-message')
    ).toContainText('Fornecedor deletado com sucesso');
  });
});

/* 



it('Remover fornecedor com sucesso', () => {
}); */
