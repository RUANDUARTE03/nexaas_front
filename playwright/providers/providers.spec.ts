import { test, expect } from '@playwright/test';

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
  let page;
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
});

/* 



it('Listagem de fornecedores com dados completos', () => {
});

it('Listagem de fornecedores com dados obrigatórios', () => {
});

it('Listagem de fornecedores com dados básicos', () => {
});

it('Botões de edição e exclusão devem ser renderizados', () => {
});

it('CPF/CNPJ já existente', () => {
});

it('CEP existente deve preencher endereço', () => {
});

it('CEP inexistente não deve preencher endereço', () => {
});

it('Editar somente campos obrigatórios', () => {
});

it('Editar todos os campos', () => {
});

it('Editar somente campos obrigatórios deve editar', () => {
});

it('Editar somente campos não obrigatórios deve falhar e apresentar erro', () => {
});

it('Cancelar modal ao tentar remover fornecedor', () => {
});

it('Remover fornecedor com sucesso', () => {
}); */
