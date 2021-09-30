import { AxiosResponse } from 'axios';
import { get } from './api';

const api = 'https://viacep.com.br';

export function getAddressByCep(
  cep: string
): Promise<AxiosResponse<any>> {
  return get(`${api}/ws/${cep}/json`);
}
