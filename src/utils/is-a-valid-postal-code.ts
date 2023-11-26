export function isAValidPostalCode(postalCode: string) {
  const postalCodeRegex = /^[0-9]{8}$/;

  return postalCodeRegex.test(postalCode);
}
