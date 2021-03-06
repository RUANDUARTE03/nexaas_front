// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
declare namespace Cypress {
  interface Chainable<Subject> {
    disableSameSiteCookieRestrictions(): void;
    enableSameSiteCookieRestrictions(): void;
  }
}

Cypress.Commands.add(
  'disableSameSiteCookieRestrictions',
  () => {
    cy.intercept('*', (req) => {
      req.on('response', (res) => {
        if (!res.headers['set-cookie']) {
          return;
        }

        const disableSameSite = (
          headerContent: string
        ): string => {
          return headerContent.replace(
            /samesite=(lax|strict)/gi,
            'samesite=none'
          );
        };

        if (Array.isArray(res.headers['set-cookie'])) {
          res.headers['set-cookie'] =
            res.headers['set-cookie'].map(disableSameSite);
        } else {
          res.headers['set-cookie'] = disableSameSite(
            res.headers['set-cookie']
          );
        }
      });
    });
  }
);
