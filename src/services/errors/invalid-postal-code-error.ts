export class InvalidPostalCodeError extends Error {
  constructor(public message = 'Invalid postal code') {
    super(message);
  }
}
