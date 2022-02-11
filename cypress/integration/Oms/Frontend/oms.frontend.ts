/// <reference types="Cypress" />

export class OmsFrontend {
  public static Login() {
    cy.visit(Cypress.env('BASE_URL'));

    cy.get('#session_email').type('lucas.silva@nexaas.com');

    cy.get('#session_password').click().type('Luc@s123');

    cy.get('.primary').click();

    cy.screenshot(`Login-page-${Date.now()}`);

    cy.url().should(
      'equal',
      'https://sandbox.oms.nexaas.com/'
    );
  }
}
