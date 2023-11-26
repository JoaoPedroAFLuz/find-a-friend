export class PostalCodeNotFoundError extends Error {
  constructor(public message = 'Postal code not found') {
    super(message);
  }
}
