export class EmailAlreadyInUseError extends Error {
  constructor(public message = 'Email already in use') {
    super(message);
  }
}
