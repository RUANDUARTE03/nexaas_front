import { Auth } from './auth';

describe('Faz login na conta do OMS', () => {
  it('Autenticação sem nexaas ID não deve ser efetuada', () => {
    Auth.authWithoutNexaasId();
  });

  it('Autenticação nexaas ID não existente não deve ser efetuada', () => {
    Auth.authNonExistentNexaasId();
  });

  it('Autenticação com senha incorreta não deve ser efetuada', () => {
    Auth.authWrongPassword();
  });
  it('Deve realizar a autenticação no OMS com sucesso', () => {
    cy.disableSameSiteCookieRestrictions();
    Auth.adminAuth();
  });
});
