import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { routes } from '../../utils/routes';

type dataMenuProps = {
  label:
    | 'Vendas'
    | 'Suprimentos'
    | 'Cadastros'
    | 'Crediário'
    | 'Configurações';
  icon: IconProp;
  redirects: string[];
  items: {
    href: string;
    newVersion: boolean;
    directNewVersion?: string;
    label: string;
  }[];
};

export const dataMenuSellers: dataMenuProps = {
  label: 'Vendas',
  icon: 'shopping-basket',
  redirects: ['/', '/boxes', 'shipments'],
  items: [
    {
      href: '/',
      newVersion: false,
      label: 'Pedidos de Vendas',
    },
    {
      href: '/boxes',
      newVersion: false,
      label: 'Delivery',
    },
    {
      href: '/shipments',
      newVersion: false,
      label: 'Expedição',
    },
  ],
};

export const dataMenuSupplies: dataMenuProps = {
  label: 'Suprimentos',
  icon: 'boxes',
  redirects: [
    '/purchase_orders',
    '/inventories',
    '/stocks',
    '/receivements',
    '/transfers',
    '/provider_returns',
  ],
  items: [
    {
      href: '/purchase_orders',
      newVersion: false,
      label: 'Pedidos de Compras',
    },
    {
      href: '/inventories',
      newVersion: false,
      label: 'Inventário',
    },
    {
      href: '/stocks',
      newVersion: false,
      label: 'Estoque',
    },
    {
      href: '/receivements',
      newVersion: false,
      label: 'Entrada de Mercadorias',
    },
    {
      href: '/transfers',
      newVersion: false,
      label: 'Transferências',
    },
    {
      href: '/provider_returns',
      newVersion: false,
      label: 'Devolução ao Fornecedor',
    },
  ],
};

export const dataMenuRegisters: dataMenuProps = {
  label: 'Cadastros',
  icon: 'clipboard-list',
  redirects: [
    '/products',
    '/customers',
    '/providers',
    '/sellers',
    '/price_tables',
    '/organizations',
    '/users',
    '/product_categories',
    '/product_feature',
    '/product_brands',
    '/manufactures',
    '/sale_channels',
  ],
  items: [
    {
      href: '/products',
      newVersion: false,
      label: 'Produtos',
    },
    {
      href: '/customers',
      newVersion: false,
      label: 'Clientes',
    },
    {
      href: '/providers',
      newVersion: true,
      directNewVersion: routes.providers.index,
      label: 'Fornecedores',
    },
    {
      href: '/sellers',
      newVersion: false,
      label: 'Vendedores',
    },
    {
      href: '/price_tables',
      newVersion: false,
      label: 'Tabelas de Preços',
    },
    {
      href: '/organizations',
      newVersion: true,
      directNewVersion: routes.organizations.index,
      label: 'Organizações',
    },
    {
      href: '/users',
      newVersion: false,
      label: 'Usuários',
    },
    {
      href: '/product_categories',
      newVersion: false,
      label: 'Categorias',
    },
    {
      href: '/product_feature',
      newVersion: false,
      label: 'Características',
    },
    {
      href: '/product_brands',
      newVersion: false,
      label: 'Marcas',
    },
    {
      href: '/manufactures',
      newVersion: false,
      label: 'Fabricantes',
    },
    {
      href: '/sale_channels',
      newVersion: false,
      label: 'Canais de Venda',
    },
  ],
};

export const dataMenuInstallment: dataMenuProps = {
  label: 'Crediário',
  icon: 'file',
  redirects: ['/credit_limit_rules'],
  items: [
    {
      href: '/credit_limit_rules',
      newVersion: false,
      label: 'Regras de Exceção',
    },
  ],
};

export const dataMenuSettings: dataMenuProps = {
  label: 'Configurações',
  icon: 'cog',
  redirects: ['/account'],
  items: [
    {
      href: '/account',
      newVersion: false,
      label: 'Integrações',
    },
  ],
};
