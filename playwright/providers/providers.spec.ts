import { test, expect } from '@playwright/test';

const REACT_URL = process.env.REACT_URL ?? '';
const PROVIDER_HOME = `${REACT_URL}/providers`;

test.describe('New Todo', () => {
  test('Menu click should redirect', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    await page
      .locator('button:has-text("Cadastros")')
      .click();

    await Promise.all([
      page.waitForNavigation({
        url: 'http://localhost:3001/providers',
      }),
      page.locator('a:has-text("Fornecedores")').click(),
    ]);

    await expect(page).toHaveURL(
      'http://localhost:3001/providers'
    );
  });

  test('Clique botão novo fornecedor deve entrar no cadastro', async ({
    page,
  }) => {
    await Promise.all([
      page.waitForNavigation({
        url: 'http://localhost:3001/providers/create',
      }),
      page
        .locator('[data-testid="btn-create-provider"]')
        .click(),
    ]);

    await expect(page).toHaveURL(
      'http://localhost:3001/providers/create'
    );
  });
});

/* iit('Criar novo fornecedor', () => {
});

it('Criar novo fornecedor com dados obrigatórios', () => {
});

it('Listagem de fornecedores com dados completos', () => {
});

it('Listagem de fornecedores com dados obrigatórios', () => {
});

it('Listagem de fornecedores com dados básicos', () => {
});

it('Botões de edição e exclusão devem ser renderizados', () => {
});

it('CPF/CNPJ já existente', () => {
});

it('CEP existente deve preencher endereço', () => {
});

it('CEP inexistente não deve preencher endereço', () => {
});

it('Editar somente campos obrigatórios', () => {
});

it('Editar todos os campos', () => {
});

it('Editar somente campos obrigatórios deve editar', () => {
});

it('Editar somente campos não obrigatórios deve falhar e apresentar erro', () => {
});

it('Cancelar modal ao tentar remover fornecedor', () => {
});

it('Remover fornecedor com sucesso', () => {
}); */
