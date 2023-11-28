export class ResourceNotFound extends Error {
  constructor(public message = 'Resource not found') {
    super(message);
  }
}
