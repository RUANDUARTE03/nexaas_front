declare namespace ApplicationWindow {
  export type Size = {
    width: number | undefined;
    height: number | undefined;
  };
}

type STORE_DEFINITION = ReturnType<
  typeof import('store').default['getState']
>;

declare namespace ErrorsFieldsDefinitions {
  export type AvailableFields = 'name' | 'manufacturerId';
}

declare namespace ApplicationDefinitions {
  export type TypeActions = 'create' | 'edit' | 'delete' | ''
  export type TypeActionsMessages = 'criado(a) com sucesso' | 'editado(a) com sucesso' | 'excluído(a) com sucesso' | ''
  export type ActionsMenu = 'brand' | 'marca' | 'provider' | 'fornecedores' | ''
}