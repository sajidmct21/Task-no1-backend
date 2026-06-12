export class ApiResponse {
  constructor(statusCode, message, payload) {
    this.statusCode = statusCode;
    this.message = message;
    this.payload = payload;
  }
}
