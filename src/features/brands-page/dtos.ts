export interface IErrorsGraphql {
  code: 'taken' | 'blank' | 'invalid';
  message: string;
  path: string[];
}
