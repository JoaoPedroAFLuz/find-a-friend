export class InvalidCredentialsError extends Error {
  constructor(public message = 'Invalid credentials') {
    super(message);
  }
}
