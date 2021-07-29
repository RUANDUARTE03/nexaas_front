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
};
