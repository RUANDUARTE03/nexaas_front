import { formatValueToReal } from './Currency';

it('Should formatter', () => {
  const formatter = formatValueToReal('1000');
  const greadFormatter = formatValueToReal('1000000');

  expect(formatter).toBe('10,00');
  expect(greadFormatter).toBe('10.000,00');
});
