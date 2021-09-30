import { include } from 'named-urls';

export const routes = {
  home: '/',
  providers: include('/providers/', {
    index: '',
    create: include('create/', {
      index: '',
    }),
    edit: include('edit/:id/', {
      index: '',
    }),
  }),
  organizations: include('/organizations/', {
    index: '',
    create: include('create/', {
      index: '',
    }),
    edit: include('edit/:id/', {
      index: '',
    }),
  }),
};
