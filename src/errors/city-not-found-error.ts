export class CityNotFoundError extends Error {
  constructor(public message = 'City not found') {
    super(message);
  }
}
