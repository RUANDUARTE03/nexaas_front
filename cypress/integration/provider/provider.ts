/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="Cypress" />

const HOME_URL = `${Cypress.env('reactHome')}providers`;

const CREATE_URL = `${Cypress.env(
  'reactHome'
)}providers/create`;

const provider = {
  city: 'Niterói',
  cityCode: '3303302',
  country: 'Brazil',
  detail: 'teste',
  document: '29979036000140',
  externalId: '1',
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
  public static menuClick() {
    cy.contains('Cadastros').click();
    cy.contains('Fornecedores').click();

    cy.url().should('equal', HOME_URL);
  }

  public static verifyProviderList() {
    const provider2 = {
      id: '2',
      document: '52.723.924/0001-10',
      name: 'Correios LTDA.',
      fantasyName: 'Correios',
      type: 'Distribuidora',
    };

    cy.get('tr').eq(1).should('contain.text', provider2.id);
    cy.get('td')
      .eq(0)
      .should('contain.text', provider2.document);
    cy.get('td')
      .eq(1)
      .should('contain.text', provider2.name);
    cy.get('td')
      .eq(2)
      .should('contain.text', provider2.fantasyName);
    cy.get('td')
      .eq(3)
      .should('contain.text', provider2.type);
  }

  public static showCreateProvider() {
    cy.get('[data-testid=btn-create-provider]').click();

    cy.url().should('equal', CREATE_URL);
  }

  public static createProvider() {
    cy.get('[data-cy=identifier]')
      .click()
      .type(provider.document);
    cy.get('[data-cy=companyName]')
      .click()
      .type(provider.name);
    cy.get('[data-cy=fantasyName]')
      .click()
      .type(provider.tradingName);
    cy.get('[data-cy=typeProvider] > select').select(
      provider.providerType
    );
    cy.get('[data-cy=indicatorSign] > select').select(
      provider.stateInscriptionType
    );
    cy.get('[data-cy=identifierExternal]')
      .click()
      .type(provider.externalId);
    cy.get('[data-cy=stateInscription]')
      .click()
      .type(provider.stateInscription);
    cy.get('[data-cy=formattedZipCode]')
      .click()
      .type(provider.zipcode);
    cy.get('[data-cy=street]')
      .click()
      .type(provider.street);
    cy.get('[data-cy=addressNumber]')
      .click()
      .type(provider.number);
    cy.get('[data-cy=addressDetail]')
      .click()
      .type(provider.detail);
    cy.get('[data-cy=district]')
      .click()
      .type(provider.neighborhood);
    cy.get('[data-cy=city]').click().type(provider.city);
    cy.get('[data-cy=cityIbgeId]')
      .click()
      .type(provider.cityCode);
    cy.get('[data-cy=stateName] > select').select(
      provider.state
    );

    cy.get(
      '[data-testid=btn-createOrEditProvider]'
    ).click();

    cy.url().should('equal', HOME_URL);
  }
}
