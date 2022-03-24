import { Page } from '@playwright/test';

const provider = {
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

export class Provider {
  public static async menuClick(page) {
    await page.goto('http://localhost:3000/');

    await page
      .locator('button:has-text("Cadastros")')
      .click();

    await Promise.all([
      page.waitForNavigation({
        url: 'http://localhost:3001/providers',
      }),
      page.locator('a:has-text("Fornecedores")').click(),
    ]);
  }

  public static async showCreateProvider(page: Page) {
    await Promise.all([
      page.waitForNavigation({
        url: 'http://localhost:3001/providers/create',
      }),
      page
        .locator('[data-testid="btn-create-provider"]')
        .click(),
    ]);

    expect(page.url()).toBe(
      'http://localhost:3001/providers/create'
    );
  }
}
