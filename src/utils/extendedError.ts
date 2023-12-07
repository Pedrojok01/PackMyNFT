export class ExtendedError extends Error {
  info?: any;
  status?: number;

  constructor(message: string) {
    super(message);
    this.name = "ExtendedError";
  }
}
