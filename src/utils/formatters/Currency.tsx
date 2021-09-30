export function formatValueToReal(value: any) {
  let valor = value;

  valor = Number(valor.replace(/[\D]+/g, ''));
  valor = valor.toString().replace(/([0-9]{2})$/g, ',$1');

  if (valor.length > 6) {
    valor = valor.replace(
      /([0-9]{3}),([0-9]{2}$)/g,
      '.$1,$2'
    );
  }

  return valor;
}
