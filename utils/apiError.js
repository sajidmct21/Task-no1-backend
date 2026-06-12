export class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", payload = null) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.payload = payload;
    this.name = this.name;
    this.stack = this.stack;
  }
}
