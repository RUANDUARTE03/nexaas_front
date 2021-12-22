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
  users: include('/users/', {
    index: '',
    create: include('create/', {
      index: '',
    }),
    edit: include('edit/:id/', {
      index: '',
    }),
  }),
  sessions: include('/sessions/', {
    new: 'new',
  }),
};
