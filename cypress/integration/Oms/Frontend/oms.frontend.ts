/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="Cypress" />

export class OmsFrontend {
  public static Login() {
    cy.visit('http://localhost:3000/sessions/new');

    cy.get('.ch-button').click();

    cy.get('#session_email').type('lucas.silva@nexaas.com');

    cy.get('#session_password').click().type('Luc@s123');

    cy.get('.primary').click();

    cy.visit('http://localhost:3000/account_selection');

    cy.get('.ch-button').click();

    cy.get('a[href="/account_selection/1"]').click();

    /* cy.url().should(
      'equal',
      'https://sandbox.oms.nexaas.com/'
    ); */
  }
}
