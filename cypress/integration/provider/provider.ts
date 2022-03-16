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
  name: 'teste 12345',
  document: '34028316000294',
  providerType: 'Fabricante',
};

export class Provider {
  public static menuClick() {
    cy.contains('Cadastros')
      .click()
      .then(() => {
        cy.contains('Fornecedores')
          .click()
          .then(() => {
            cy.url().should('equal', HOME_URL);
          });
      });
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
    cy.get('[data-testid=btn-create-provider]')
      .click()
      .then(() => {
        cy.url().should('equal', CREATE_URL);
      });
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
    cy.get('[data-cy=addressNumber]')
      .click()
      .type(provider.number);
    cy.get('[data-cy=addressDetail]')
      .click()
      .type(provider.detail);

    cy.get('[data-cy=stateName] > select').select(
      provider.state
    );
    cy.get(
      '[data-testid=btn-createOrEditProvider]'
    ).click();

    cy.url().should('equal', HOME_URL);
  }

  public static createWithExistentDocument() {
    cy.get('[data-testid=btn-create-provider]').click();

    cy.get('[data-cy=identifier]')
      .click()
      .type(provider.document);

    cy.get(
      '[data-testid=btn-createOrEditProvider]'
    ).click();
    cy.contains('já está em uso');
    cy.url().should('equal', CREATE_URL);
  }

  public static existentCepShouldFillAddress() {
    cy.get('[data-cy=formattedZipCode]')
      .click()
      .type('07400295');

    cy.get('[data-cy=street] > input').should(
      'have.value',
      'Rua Perfeita Liberdade'
    );
    cy.get('[data-cy=district] > input').should(
      'have.value',
      'Jardim Ângelo'
    );
    cy.get('[data-cy=city] > input').should(
      'have.value',
      'Arujá'
    );
    cy.get('[data-cy=cityIbgeId] > input').should(
      'have.value',
      '3503901'
    );
    cy.get('[data-cy=stateName] > select').should(
      'have.value',
      'SP'
    );
    cy.get(
      '[data-testid=btn-createOrEditProvider-cancel]'
    ).click();
  }

  public static nonExistentCepShouldNotFillAddress() {
    cy.get('[data-testid=btn-create-provider]').click();

    cy.get('[data-cy=formattedZipCode]')
      .click()
      .type('12345678');

    cy.get('[data-cy=street] > input').should('be.empty');
    cy.get('[data-cy=district] > input').should('be.empty');
    cy.get('[data-cy=city] > input').should('be.empty');
    cy.get('[data-cy=cityIbgeId] > input').should(
      'be.empty'
    );
    cy.get(
      '[data-testid=btn-createOrEditProvider-cancel]'
    ).click();
  }

  public static createWithRequiredFields() {
    cy.get('[data-testid=btn-create-provider]').click();
    cy.get('[data-cy=identifier]')
      .click()
      .type(onlyRequiredProvider.document);
    cy.get('[data-cy=companyName]')
      .click()
      .type(onlyRequiredProvider.name);

    cy.get('[data-cy=typeProvider] > select').select(
      onlyRequiredProvider.providerType
    );

    cy.get(
      '[data-testid=btn-createOrEditProvider]'
    ).click();

    cy.url().should('equal', HOME_URL);
  }

  public static editOnlyRequiredField() {
    cy.get(
      `[data-testid=btn-edit-provider-${provider.document}]`
    );
    cy.get('[data-cy=companyName]')
      .click()
      .type('nome modificado');

    cy.get('[data-cy=typeProvider] > select').select(
      onlyRequiredProvider.providerType
    );

    cy.get(
      '[data-testid=btn-createOrEditProvider]'
    ).click();

    cy.url().should('equal', HOME_URL);
  }

  public static editFields() {
    cy.get(
      `[data-testid=btn-edit-provider-${provider.document}]`
    )
      .click()
      .then(() => {
        cy.get('[data-cy=companyName]')
          .clear()
          .click()
          .type('nome modificado 2');
        cy.get('[data-cy=fantasyName]')
          .clear()
          .click()
          .type('nome modificado 2');
        cy.get('[data-cy=typeProvider] > select').select(
          'Distribuidora'
        );
        cy.get('[data-cy=indicatorSign] > select').select(
          '2'
        );
        cy.get('[data-cy=identifierExternal]')
          .clear()
          .click()
          .type('2');
        cy.get('[data-cy=stateInscription]')
          .clear()
          .click()
          .type('12344321');
        cy.get('[data-cy=formattedZipCode]')
          .clear()
          .click()
          .type('07400265');
        cy.get('[data-cy=addressNumber]')
          .clear()
          .click()
          .type('13');
        cy.get('[data-cy=addressDetail]')
          .clear()
          .click()
          .type('detalhe');

        cy.get('[data-cy=stateName] > select').select('SP');
        cy.get(
          '[data-testid=btn-createOrEditProvider]'
        ).click();

        cy.url().should('equal', HOME_URL);
      });
  }
}
