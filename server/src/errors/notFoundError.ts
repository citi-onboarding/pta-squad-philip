import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(message = "Something Wrong. The values was NOT FOUND") {
    super(message, 404);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}