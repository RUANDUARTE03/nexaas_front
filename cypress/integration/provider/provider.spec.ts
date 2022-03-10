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

  it('CPF/CNPJ já existente', () => {
    Provider.createWithExistentDocument();
  });

  it('CEP existente deve preencher endereço', () => {
    Provider.existentCepShouldFillAddress();
  });

  it('CEP inexistente não deve preencher endereço', () => {
    Provider.nonExistentCepShouldNotFillAddress();
  });
});
