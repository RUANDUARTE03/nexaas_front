import { OmsFrontend } from './oms.frontend';

describe('Faz login na conta do OMS', function () {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('_estoka_session');
    Cypress.Cookies.preserveOnce('_nexaas_id_session');
    Cypress.Cookies.preserveOnce('_ga_L9CS82X7C9');
    Cypress.Cookies.preserveOnce('_ga');
    Cypress.Cookies.preserveOnce('_estoka_session');
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
  });
  it('Realiza o login no OMS', function () {
    OmsFrontend.Login();
  });
});
