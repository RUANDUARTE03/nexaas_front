import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { routes } from '../../utils/routes';

type dataMenuProps = {
  label:
    | 'Vendas'
    | 'Suprimentos'
    | 'Cadastros'
    | 'Crediário'
    | 'Promoções'
    | 'Configurações';
  icon: IconProp | string;
  redirects: string[];
  dataCy?: string;
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
      href: '/budgets',
      newVersion: false,
      label: 'Orçamentos',
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
  dataCy: 'cadastros',
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
    '/manufacturers',
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
      label: 'Colaboradores',
    },
    {
      href: '/price_tables',
      newVersion: false,
      label: 'Tabelas de Preço',
    },
    {
      href: '/organizations',
      newVersion: false,
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
      newVersion: true,
      directNewVersion: routes.brands.index,
      label: 'Marcas',
    },
    {
      href: '/manufacturers',
      newVersion: false,
      label: 'Fabricantes',
    },
    {
      href: '/sale_channels',
      newVersion: false,
      label: 'Canais de Vendas',
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

export const dataMenuPromotions: dataMenuProps = {
  label: 'Promoções',
  icon: 'badge-percent',
  redirects: ['/discounts'],
  items: [
    {
      href: '/discounts',
      newVersion: false,
      label: 'Descontos',
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
