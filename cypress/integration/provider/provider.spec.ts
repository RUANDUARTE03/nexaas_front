import { Auth } from '../Auth/auth';
import { Provider } from './provider';

describe('Testes relacionados a fornecedores', () => {
  beforeEach('', () => {
    Cypress.Cookies.debug(true);
    Cypress.Cookies.defaults({
      preserve: [
        '_estoka_session',
        '_nexaas_id_session',
        '_nexaas_id_remember_me',
        '_ga_L9CS82X7C9',
        '_ga',
      ],
    });
    cy.disableSameSiteCookieRestrictions();
  });
  it('Clique no menu de fornecedores deve redirecionar corretamente', () => {
    Auth.adminAuth();
    Provider.menuClick();
  });

  it('Listagem de fornecedores com dados básicos', () => {
    Provider.verifyProviderList();
  });

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

  it('Editar somente campos obrigatórios', () => {
    Provider.editOnlyRequiredField();
  });

  it('Editar todos os campos', () => {
    Provider.editFields();
  });

  it('Cancelar modal ao tentar remover fornecedor', () => {
    Provider.cancelDeleteProvider();
  });

  it('Remover fornecedor com sucesso', () => {
    Provider.deleteProviderWithSuccess();
  });
});
