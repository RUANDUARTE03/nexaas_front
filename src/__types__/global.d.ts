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
  export type AvailableFields =
    | 'Name'
    | 'manufacturerId'
    | 'tradingName'
    | 'providerType'
    | 'stateInscriptionType'
    | 'stateInscription'
    | 'externalId'
    | 'document'
    | 'CEP'
    | 'AddressNumber'
    | 'Email'
    | 'Role'
    | 'CNPJ'
    | 'CompanyName'
    | 'Kind'
    | 'ZipCode'
    | 'Street'
    | 'AverageWithdrawalTerm'
    | 'AverageWithdrawalPrice'
    | 'deliveryRadiusMax'
    | 'Taxregime'
    | 'Serienfe'
    | 'EmitesId'
    | 'Longitude'
    | 'Latitude'
    | 'State'
    | 'CityCode'
    | 'City'
    | 'Neighborhood'
    | 'Complement'
    | 'Number'
    | 'StateRegistration';
}

declare namespace ApplicationDefinitions {
  export type TypeActions =
    | 'create'
    | 'edit'
    | 'delete'
    | '';
  export type TypeActionsMessages =
    | 'criado(a) com sucesso'
    | 'editado(a) com sucesso'
    | 'excluído(a) com sucesso'
    | '';
  export type ActionsMenu =
    | 'brand'
    | 'marca'
    | 'provider'
    | 'fornecedor'
    | 'manufacturer'
    | 'fabricante'
    | 'user'
    | 'usuário'
    | 'organization'
    | 'organizações';
}
