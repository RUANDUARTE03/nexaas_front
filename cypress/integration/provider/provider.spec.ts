import { Auth } from '../Auth/auth';
import { Provider } from './provider';

describe('Testes relacionados a fornecedores', () => {
  it('Clique no menu de fornecedores deve redirecionar corretamente', () => {
    cy.disableSameSiteCookieRestrictions();
    Auth.adminAuth();
    Provider.menuClick();
  });

  /* it('Listagem de fornecedores com dados básicos', () => {
    Provider.verifyProviderList();
  }); */

  it('Clique botão novo fornecedor deve entrar no cadastro', () => {
    Provider.showCreateProvider();
  });

  it('Criar novo fornecedor', () => {
    Provider.createProvider();
  });
});
