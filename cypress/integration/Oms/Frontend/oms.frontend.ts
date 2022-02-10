/// <reference types="Cypress" />

export class OmsFrontend {
  public static Login() {
    cy.visit('https://id.nexaas.com/sign_in');

    /* cy.get('.ch-button').click(); */

    cy.get('#session_password').type('Senha123@');

    cy.get('#session_email').type(
      'lucas.duarte@nexaas.com'
    );

    cy.get('.submit').click();

    cy.screenshot(`Login-page-${Date.now()}`);

    cy.url().should(
      'equal',
      'https://sandbox.oms.nexaas.com/'
    );
  }
}
