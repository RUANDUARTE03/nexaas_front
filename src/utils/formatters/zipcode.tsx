export function formatZipCode(zipcode: string): string {
  /* eslint-disable-next-line no-useless-escape */
  const regex = /^([\d]{2})\.?([\d]{3})\-?([\d]{3})/;

  if (zipcode.length === 8) {
    return zipcode.replace(regex, '$1$2-$3');
  }

  return zipcode;
}

export function unformatZipCode(zipcode: string): string {
  return zipcode.replace('-', '');
}
