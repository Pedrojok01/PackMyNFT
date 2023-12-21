export class ExtendedError extends Error {
  info?: NFTResponse | TokenResponse;
  status?: number;

  constructor(message: string) {
    super(message);
    this.name = "ExtendedError";
  }
}
