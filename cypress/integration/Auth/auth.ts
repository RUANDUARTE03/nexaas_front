/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="Cypress" />

export class Auth {
  public static adminAuth() {
    cy.visit(Cypress.env('newSession'));

    cy.get('.ch-button').click();

    cy.get('#session_email').type(
      Cypress.env('adminEmail')
    );

    cy.get('#session_password')
      .click()
      .type(Cypress.env('adminPassword'));

    cy.get('.primary').click();

    cy.visit(Cypress.env('accountSelectionURL'));

    cy.get('.ch-button').click();

    cy.get('a[href="/account_selection/1"]').click();

    cy.url().should('equal', Cypress.env('home'));

    cy.screenshot('admin-auth');
  }

  public static authWithoutNexaasId() {
    cy.visit(Cypress.env('newSession'));

    cy.get('.ch-button').click();

    cy.get('#session_password')
      .click()
      .type(Cypress.env('adminPassword'));

    cy.get('.primary').click();

    cy.screenshot('auth-without-nexaas-id');

    cy.url().should('equal', Cypress.env('credentialsURL'));
  }

  public static authNonExistentNexaasId() {
    cy.visit(Cypress.env('newSession'));

    cy.get('.ch-button').click();

    cy.get('#session_email').type(
      'naoexisto123@naoexisto.com'
    );

    cy.get('#session_password')
      .click()
      .type('naoexisto123');

    cy.get('.primary').click();

    cy.screenshot('auth-non-existent-nexaas-id');

    cy.url().should('equal', Cypress.env('credentialsURL'));
  }

  public static authWrongPassword() {
    cy.visit(Cypress.env('newSession'));

    cy.get('.ch-button').click();

    cy.get('#session_email').type(
      Cypress.env('adminEmail')
    );

    cy.get('#session_password')
      .click()
      .type('wrongpassword');

    cy.get('.primary').click();

    cy.screenshot('auth-wrong-password');

    cy.url().should('equal', Cypress.env('credentialsURL'));
  }
}
